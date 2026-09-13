import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

// paths that look like a user page but are no user page
const RESERVED_SEGMENTS = [
    'about',
    'account',
    'apps',
    'codespaces',
    'collections',
    'contact',
    'dashboard',
    'events',
    'explore',
    'features',
    'issues',
    'join',
    'login',
    'logout',
    'marketplace',
    'new',
    'notifications',
    'orgs',
    'pricing',
    'pulls',
    'search',
    'security',
    'services',
    'sessions',
    'settings',
    'sponsors',
    'topics',
    'trending',
];

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'atom' });

const detect = (url: URL): DetectedFeed[] => {
    const [owner, repo, section, branch] = pathSegments(url);

    if (owner === undefined || RESERVED_SEGMENTS.includes(owner.toLowerCase())) {
        return [];
    }

    if (repo === undefined) {
        return [feed(`GitHub Activity (${owner})`, `${url.origin}/${owner}.atom`)];
    }

    const repoUrl = `${url.origin}/${owner}/${repo}`;
    const repoName = `${owner}/${repo}`;

    if (section === 'commits' && branch !== undefined) {
        return [feed(`GitHub Commits (${repoName} ${branch})`, `${repoUrl}/commits/${branch}.atom`)];
    }

    if (section === 'releases' || section === 'tags') {
        return [feed(`GitHub ${section === 'tags' ? 'Tags' : 'Releases'} (${repoName})`, `${repoUrl}/${section}.atom`)];
    }

    return [
        feed(`GitHub Releases (${repoName})`, `${repoUrl}/releases.atom`),
        feed(`GitHub Tags (${repoName})`, `${repoUrl}/tags.atom`),
        feed(`GitHub Commits (${repoName})`, `${repoUrl}/commits.atom`),
    ];
};

export const githubDetector: SiteDetector = {
    hostnames: ['github.com'],
    detect,
};
