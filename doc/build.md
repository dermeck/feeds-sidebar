# Creating a new Release

## `yarn release`

An interactive script that does the whole release: it asks for the version number, runs the tests and the
production build, sets the version in `src/manifest.json` and `package.json`, commits, tags, pushes, creates
`dist/*.zip` and signs the add-on.

It asks for

- the version number, prefilled with the next patch version. The suggestions for a minor and a major bump are
  printed above the prompt. addons.mozilla.org accepts one to four numbers without leading zeros.
- the channel, `unlisted` (a signed `.xpi` for self-installation) or `listed` (a submission to
  addons.mozilla.org for review).
- the AMO API key and secret, unless they are already in `.env`. Both are needed to sign.

The tag is derived from the version (`0.61.0` becomes `v0.61.0`), the commit message is `Version 0.61.0` and only
the two version files end up in that commit. The release is cut from the checked out branch, `master` is only
pointed out in the summary.

```
yarn release
yarn release --dry-run          # everything except the commit, the tag, the push and the artifacts
yarn release 0.61.0 --no-push   # the version as an argument, keep the commit and the tag local
```

Other flags: `--channel=unlisted|listed`, `--api-key=…`, `--api-secret=…`, `--skip-tests`, `--skip-build`,
`--no-push`, `--yes` (take every default, for an unattended run).

## By hand

- increase the version number in `src/manifest.json` and `package.json`
- create a new tag with with the version number (eg `git tag v0.12`) and push it (`git push origin v0.12`.
- (in case it's need, tag can be remove with `git push --delete origin v0.12`)

## Self hosted xpi (permanent installation)
To create an installable `.xpi` file the extension must be [signed](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext_sign).

```
yarn run web-ext sign --channel=unlisted  --source-dir=build --api-key=user:xxxxxxx:xxx --api-secret=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The credentials can be configured in the `.env` file. 

### `yarn build:xpi` 
will perform a prod build and call `web-ext sign` with the configured credentials.

This will create the `.xpi` file in the `/dist` folder.

### Release build
`yarn release` asks for the channel, so a `listed` build is a choice there instead of an edit of the `sign` script.

### Install the extension (xpi)
- in Firefox navigate to `about:addons` > `Tools for all add-ons` (gear icon) > `Install Add-on From File...`

## Create zip file

### `yarn build:zip`

will perform a prod build and bundle the output into a zip file in the `/dist` folder.

---

## Further information
- https://mozilla.github.io/addons-server/topics/api/addons.html#version-create
- https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/
- https://extensionworkshop.com/documentation/publish/submitting-an-add-on/