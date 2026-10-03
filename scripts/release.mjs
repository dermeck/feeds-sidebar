#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const PACKAGE_JSON = 'package.json';
const MANIFEST_JSON = 'src/manifest.json';
const VERSION_FILES = [PACKAGE_JSON, MANIFEST_JSON];

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const option = (name) => {
    const inline = argv.find((arg) => arg.startsWith(`--${name}=`));
    if (inline) return inline.slice(name.length + 3);
    const index = argv.indexOf(`--${name}`);
    return index === -1 ? undefined : argv[index + 1];
};
// a bare argument is taken as the version, so `release.mjs 0.61.0` works too
const bare = () => argv.find((arg) => !arg.startsWith('-'));

const fail = (message) => {
    restoreVersions();
    console.error(`\nerror: ${message}`);
    process.exit(1);
};

process.on('SIGINT', () => fail('interrupted'));
process.on('SIGTERM', () => fail('interrupted'));

const run = (command, args, { capture = false } = {}) => {
    const result = spawnSync(command, args, {
        stdio: capture ? 'pipe' : 'inherit',
        encoding: 'utf8',
    });
    if (result.error?.code === 'ENOENT') return { code: 127, out: '' };
    const out = capture && result.stdout ? result.stdout.replace(/\r?\n$/, '') : '';
    return { code: result.status ?? 1, out };
};

const git = (...args) => run('git', args, { capture: true });
const gitOrFail = (...args) => {
    const { code, out } = git(...args);
    if (code !== 0) fail(`git ${args.join(' ')} failed`);
    return out;
};

// a readline interface drops the lines that arrive in the same chunk, so piped answers are queued up front
const createPrompter = async () => {
    if (stdin.isTTY) {
        const rl = createInterface({ input: stdin, output: stdout });
        return {
            ask: async (question) => (await rl.question(question)).trim(),
            // the mask needs node 22.13 or newer, older versions just echo the input
            askSecret: async (question) => (await rl.question(question, { mask: '*' })).trim(),
            close: () => rl.close(),
        };
    }
    let piped = '';
    for await (const chunk of stdin) piped += chunk;
    const lines = piped.split('\n');
    const next = async (question) => {
        process.stdout.write(question);
        if (lines.length === 0) return null;
        return lines.shift().trim();
    };
    return { ask: next, askSecret: next, close: () => {} };
};

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const versionOf = (file) => readJson(file).version;

// addons.mozilla.org accepts one to four dot separated integers, no leading zeros, 65535 each at most
const isReleaseVersion = (value) => {
    const parts = value.split('.');
    return parts.length <= 4 && parts.every((part) => /^(0|[1-9]\d*)$/.test(part) && Number(part) <= 65535);
};

const compareVersions = (left, right) => {
    const parts = (value) => value.split('.').concat(['0', '0', '0', '0']).slice(0, 4).map(Number);
    const [a, b] = [parts(left), parts(right)];
    return a.findIndex((part, index) => part !== b[index]);
};

const bump = (version, level) => {
    const [major = 0, minor = 0, patch = 0] = version.split('.').map(Number);
    if (level === 'major') return `${major + 1}.0.0`;
    if (level === 'minor') return `${major}.${minor + 1}.0`;
    return `${major}.${minor}.${patch + 1}`;
};

// rewritten before the build so the copied manifest carries the new version, and kept until
// the commit so a failure in between puts the tree back
let versionBackup = null;

const setVersion = (version) => {
    if (versionBackup) return;
    versionBackup = VERSION_FILES.map((file) => [file, readFileSync(file, 'utf8')]);
    VERSION_FILES.forEach((file) => {
        const before = readFileSync(file, 'utf8');
        // a targeted replace keeps the formatting, writing back the parsed json would reflow the whole file
        const after = before.replace(/("version"\s*:\s*")[^"]*(")/, `$1${version}$2`);
        if (after === before) fail(`no version field found in ${file}`);
        writeFileSync(file, after);
    });
};

const restoreVersions = () => {
    if (!versionBackup) return;
    versionBackup.forEach(([file, contents]) => writeFileSync(file, contents));
    versionBackup = null;
};

const keepVersion = () => {
    versionBackup = null;
};

const heading = (text) => console.log(`\n${text}\n${'-'.repeat(text.length)}`);

const CHANNELS = [
    { name: 'unlisted', label: 'unlisted - signed .xpi for self-installation' },
    { name: 'listed', label: 'listed   - submit to addons.mozilla.org for review' },
];

const main = async () => {
    const packageManager = run('yarn', ['--version'], { capture: true }).code === 0 ? 'yarn' : 'npm';
    const webExt = existsSync('node_modules/.bin/web-ext') ? 'node_modules/.bin/web-ext' : 'web-ext';
    const hasGh = run('gh', ['--version'], { capture: true }).code === 0;

    if (git('rev-parse', '--git-dir').code !== 0) fail('not a git repository');
    const branch = git('symbolic-ref', '--short', 'HEAD');
    if (branch.code !== 0) fail('detached HEAD, check out a branch first');
    const dirty = git('status', '--porcelain').out;
    if (dirty) fail(`working tree is not clean:\n${dirty}`);

    const versions = VERSION_FILES.map(versionOf);
    if (new Set(versions).size > 1) {
        fail(`${PACKAGE_JSON} is at ${versions[0]} but ${MANIFEST_JSON} is at ${versions[1]}, fix that first`);
    }
    const current = versions[0];
    const localTags = new Set(git('tag', '--list').out.split('\n').filter(Boolean));

    const upstream = git('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}');
    const ahead = upstream.code === 0 ? git('rev-list', '--count', `${upstream.out}..HEAD`).out : null;
    // @{u} is <remote>/<branch>, git push wants the two separately
    const separator = upstream.out.indexOf('/');
    const upstreamRemote = separator === -1 ? 'origin' : upstream.out.slice(0, separator);
    const upstreamBranch = separator === -1 ? upstream.out : upstream.out.slice(separator + 1);

    const prompt = await createPrompter();
    const confirm = async (question, fallback) => {
        if (flag('yes')) return fallback;
        for (;;) {
            const line = await prompt.ask(`${question} (${fallback ? 'Y/n' : 'y/N'}) `);
            if (line === null || line === '') return fallback;
            const answer = line.toLowerCase();
            if (answer === 'y' || answer === 'yes') return true;
            if (answer === 'n' || answer === 'no') return false;
            console.log('  pick y or n');
        }
    };
    const choose = async (question, options) => {
        if (options.length === 0) fail(`no options for ${question}`);
        options.forEach((label, index) => console.log(`  ${index + 1}) ${label}`));
        for (;;) {
            const line = await prompt.ask(`${question} [1-${options.length}] `);
            if (line === null) fail(`no answer for ${question}`);
            const index = Number(line) - 1;
            if (line !== '' && Number.isInteger(index) && index >= 0 && index < options.length) return index;
            console.log('  pick one of the listed options');
        }
    };

    heading('Feeds release');
    console.log(`version : ${current}`);
    console.log(`branch  : ${branch.out}${ahead ? ` (${ahead} commit(s) ahead of ${upstream.out})` : ''}`);
    if (branch.out !== 'master') console.log(`note    : not master, the release is cut from ${branch.out}`);
    console.log(
        `options : ${bump(current, 'patch')} patch, ${bump(current, 'minor')} minor, ${bump(current, 'major')} major`,
    );

    heading('Version');
    const given = option('version') ?? bare();
    let version;
    for (;;) {
        const answer = given ?? (await prompt.ask(`new version [${bump(current, 'patch')}] `));
        version = answer || bump(current, 'patch');
        const tag = `v${version}`;
        if (!isReleaseVersion(version)) {
            console.log(`  ${version} is not a valid add-on version, one to four numbers without leading zeros`);
        } else if (compareVersions(version, current) <= 0) {
            console.log(`  ${version} is not newer than ${current}`);
        } else if (
            localTags.has(tag) ||
            git('ls-remote', '--exit-code', '--tags', 'origin', `refs/tags/${tag}`).code === 0
        ) {
            console.log(`  tag ${tag} already exists`);
        } else {
            break;
        }
        if (given) fail(`cannot use the version ${version}`);
    }

    heading('Plan');
    VERSION_FILES.forEach((file) => console.log(`  ${file.padEnd(19)} ${current} -> ${version}`));
    console.log(`  commit             "Version ${version}" with those two files only`);
    console.log(`  tag                v${version}, lightweight, on that commit`);
    if (upstream.code === 0) console.log(`  push               ${upstream.out} and v${version}`);

    heading('Checks');
    const runTests = flag('skip-tests') ? false : await confirm('Run the test suite?', true);
    const runBuild = flag('skip-build') ? false : await confirm('Run the production build (lint + webpack)?', true);

    if (runTests && run(packageManager, ['run', 'test']).code !== 0) fail('tests failed, nothing was changed');

    heading('Distribution');
    const requested = option('channel');
    if (requested && !CHANNELS.some((entry) => entry.name === requested)) fail(`unknown channel ${requested}`);
    const channelIndex = requested
        ? CHANNELS.findIndex((entry) => entry.name === requested)
        : await choose(
              'release channel',
              CHANNELS.map((entry) => entry.label),
          );
    const channel = CHANNELS[channelIndex];

    const apiKey = option('api-key') ?? (await prompt.askSecret('AMO API key (JWT issuer, e.g. user:12345678:123): '));
    const apiSecret =
        option('api-secret') ??
        (await prompt.askSecret('AMO API secret (JWT secret, the long string on the API keys page): '));
    if (!apiKey || !apiSecret) fail('the AMO API key and the API secret are both needed to sign');

    const push =
        !flag('no-push') &&
        upstream.code === 0 &&
        (await confirm(`Push ${upstreamBranch} to ${upstreamRemote} and the tag?`, true));
    const ghRelease = hasGh && (await confirm('Create a GitHub Release with the artifacts?', true));

    heading('Confirm');
    [
        `set ${VERSION_FILES.join(' and ')} to ${version}`,
        'commit and tag',
        push && `push ${upstream.out} and the tag`,
        runBuild && 'create dist/*.zip',
        `sign as ${channel.name}`,
        ghRelease && 'create a GitHub Release',
    ]
        .filter(Boolean)
        .forEach((action) => console.log(`  - ${action}`));
    if (!(await confirm('Proceed?', true))) {
        console.log('aborted, nothing was changed');
        prompt.close();
        return;
    }
    if (flag('dry-run')) {
        console.log(`\ndry run, nothing was written`);
        prompt.close();
        return;
    }
    prompt.close();

    setVersion(version);
    if (runBuild) {
        if (run(packageManager, ['run', 'build']).code !== 0) fail('build failed, nothing was changed');
        const built = versionOf('build/manifest.json');
        if (built !== version) fail(`build/manifest.json is at ${built}, expected ${version}`);
        console.log(`build/manifest.json is at ${built}`);
    }

    gitOrFail('add', ...VERSION_FILES);
    gitOrFail('commit', '-m', `Version ${version}`);
    keepVersion();
    gitOrFail('tag', `v${version}`);
    const commit = gitOrFail('rev-parse', '--short', 'HEAD');
    console.log(`\ncommitted ${commit}, tagged v${version}`);

    if (push) {
        if (run('git', ['push', upstreamRemote, upstreamBranch]).code !== 0)
            fail(`could not push ${upstream.out}, the tag is local only`);
        if (run('git', ['push', upstreamRemote, `v${version}`]).code !== 0) fail(`could not push the tag v${version}`);
        console.log(`pushed ${upstream.out} and v${version}`);
    }

    if (runBuild) {
        if (run(webExt, ['build', '--source-dir=build', '--artifacts-dir=dist']).code !== 0) fail('no zip was created');
        const sign = ['sign', `--channel=${channel.name}`, '--source-dir=build', '--artifacts-dir=dist'];
        // a listed version is reviewed asynchronously, waiting for the approval would block the release
        if (channel.name === 'listed') sign.push('--approval-timeout=0');
        // the credentials go through the environment, web-ext reads WEB_EXT_API_KEY and WEB_EXT_API_SECRET
        process.env.WEB_EXT_API_KEY = apiKey;
        process.env.WEB_EXT_API_SECRET = apiSecret;
        if (run(webExt, sign).code !== 0) fail('signing failed, the commit and the tag are fine');
    } else {
        console.log('no build was made, run yarn build:zip before signing');
    }

    if (ghRelease) {
        const files = existsSync('dist')
            ? readdirSync('dist')
                  .filter((name) => name.endsWith('.zip') || name.endsWith('.xpi'))
                  .map((name) => `dist/${name}`)
            : [];
        if (files.length === 0) fail('no .zip or .xpi in dist/ to attach to the GitHub Release');
        if (
            run('gh', ['release', 'create', `v${version}`, ...files, '--title', `v${version}`, '--generate-notes'])
                .code !== 0
        ) {
            fail('could not create the GitHub Release');
        }
    }

    heading('Done');
    console.log(`version   ${version}`);
    console.log(`commit    ${commit}`);
    console.log(`tag       v${version}${push ? ', pushed' : ', local only'}`);
    if (runBuild) console.log(`artifacts dist/*.zip and dist/*.xpi, signed as ${channel.name}`);
    if (!hasGh) console.log(`release   https://github.com/dermeck/feeds-sidebar/releases/new?tag=v${version}`);
};

main().catch((error) => fail(error.message));
