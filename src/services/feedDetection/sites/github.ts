import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const RESERVED_SEGMENTS = [
    'about',
    'account',
    'apps',
    'blog',
    'codespaces',
    'collections',
    'contact',
    'customer-stories',
    'dashboard',
    'enterprise',
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
    'organizations',
    'orgs',
    'premium',
    'pricing',
    'pulls',
    'readme',
    'search',
    'security',
    'services',
    'sessions',
    'settings',
    'site',
    'stars',
    'topics',
    'trending',
    'users',
];

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'atom' });

const detect = (url: URL): DetectedFeed[] => {
    const segments = pathSegments(url);
    const [owner, repo, section, branch] = segments;

    if (segments.some((segment) => /\.(rss|atom|xml)$/.test(segment))) {
        return [];
    }

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
        const label = section === 'tags' ? 'Tags' : 'Releases';
        return [feed(`GitHub ${label} (${repoName})`, `${repoUrl}/${section}.atom`)];
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