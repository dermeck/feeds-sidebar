import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

// hacker news only provides a feed for the frontpage, feeds for everything else are provided by hnrss.org
const HNRSS_ORIGIN = 'https://hnrss.org';

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'rss' });

const frontpageFeed = (url: URL) => feed('Hacker News Frontpage', `${url.origin}/rss`);

const detect = (url: URL): DetectedFeed[] => {
    const [first] = pathSegments(url);

    if (first === 'user') {
        const userName = url.searchParams.get('id');

        if (userName !== null) {
            return [
                feed(`Hacker News Submissions (${userName})`, `${HNRSS_ORIGIN}/submitted?id=${userName}`),
                feed(`Hacker News Comments (${userName})`, `${HNRSS_ORIGIN}/threads?id=${userName}`),
            ];
        }
    }

    if (first === 'item') {
        const itemId = url.searchParams.get('id');

        if (itemId !== null) {
            return [feed(`Hacker News Comments (item ${itemId})`, `${HNRSS_ORIGIN}/item?id=${itemId}&comments=true`)];
        }
    }

    if (first === 'newest' || first === 'ask' || first === 'show') {
        return [feed(`Hacker News (${first})`, `${HNRSS_ORIGIN}/${first}`), frontpageFeed(url)];
    }

    return [frontpageFeed(url)];
};

export const hackerNewsDetector: SiteDetector = {
    hostnames: ['news.ycombinator.com'],
    detect,
};
