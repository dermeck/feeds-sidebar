import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const RESERVED_SEGMENTS = ['-', 'admin', 'dashboard', 'explore', 'groups', 'help', 'projects', 'search', 'users'];

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'atom' });

const detect = (url: URL): DetectedFeed[] => {
    const segments = pathSegments(url);

    if (segments.some((segment) => /\.(rss|atom|xml)$/.test(segment))) {
        return [];
    }

    const separatorIndex = segments.indexOf('-');
    const projectSegments = separatorIndex === -1 ? segments : segments.slice(0, separatorIndex);
    const [first] = projectSegments;

    if (first === undefined || RESERVED_SEGMENTS.includes(first.toLowerCase())) {
        return [];
    }

    if (projectSegments.length === 1) {
        return [feed(`GitLab Activity (${first})`, `${url.origin}/${first}.atom`)];
    }

    const projectPath = projectSegments.join('/');

    return [
        feed(`GitLab Activity (${projectPath})`, `${url.origin}/${projectPath}.atom`),
        feed(`GitLab Issues (${projectPath})`, `${url.origin}/${projectPath}/-/issues.atom`),
        feed(`GitLab Tags (${projectPath})`, `${url.origin}/${projectPath}/-/tags?format=atom`),
    ];
};

export const gitlabDetector: SiteDetector = {
    hostnames: ['gitlab.com'],
    detect,
};