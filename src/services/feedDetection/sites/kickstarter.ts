import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'atom' });

const detect = (url: URL): DetectedFeed[] => {
    const segments = pathSegments(url);
    const [first, second, third, fourth] = segments;

    if (segments.some((segment) => /\.(rss|atom|xml)$/.test(segment))) {
        return [];
    }

    if (first === 'projects' && second !== undefined && third !== undefined && fourth === undefined) {
        return [feed(`Kickstarter ${second}/${third}`, `${url.origin}/projects/${second}/${third}/posts.atom`)];
    }

    return [];
};

export const kickstarterDetector: SiteDetector = {
    hostnames: ['kickstarter.com'],
    detect,
};