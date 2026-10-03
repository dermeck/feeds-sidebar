import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'rss' });

const detect = (url: URL): DetectedFeed[] => {
    const [first] = pathSegments(url);

    if (first === 'rss' || first === 'news') {
        return [];
    }

    return [feed('Hacker News Frontpage', `${url.origin}/rss`)];
};

export const hackerNewsDetector: SiteDetector = {
    hostnames: ['news.ycombinator.com'],
    detect,
};