import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'rss' });

const detect = (url: URL): DetectedFeed[] => {
    const segments = pathSegments(url);

    if (segments.some((segment) => segment === 'feed' || /\.(rss|atom|xml)$/.test(segment))) {
        return [];
    }

    // Every page of a publication - /, /about, /archive - shares the same publication feed
    return [feed(`Substack (${url.hostname.replace(/^www\./, '')})`, `${url.origin}/feed`)];
};

export const substackDetector: SiteDetector = {
    hostnames: ['substack.com'],
    detect,
};