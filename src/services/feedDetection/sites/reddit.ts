import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const SORT_SEGMENTS = ['new', 'hot', 'top', 'rising', 'best', 'controversial'];

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'rss' });

const detect = (url: URL): DetectedFeed[] => {
    const segments = pathSegments(url);
    const [first, second, third, fourth] = segments;

    if (first === undefined) {
        return [feed('Reddit Frontpage', `${url.origin}/.rss`)];
    }

    if (first === 'r' && second !== undefined) {
        if (third === 'comments' && fourth !== undefined) {
            // comments of a single post: /r/{subreddit}/comments/{postId}/{slug}
            return [feed(`Reddit Post (r/${second})`, `${url.origin}/r/${second}/comments/${fourth}/.rss`)];
        }

        const sort = third !== undefined && SORT_SEGMENTS.includes(third) ? third : undefined;

        return sort === undefined
            ? [feed(`Reddit r/${second}`, `${url.origin}/r/${second}/.rss`)]
            : [feed(`Reddit r/${second} (${sort})`, `${url.origin}/r/${second}/${sort}/.rss`)];
    }

    if ((first === 'user' || first === 'u') && second !== undefined) {
        if (third === 'm' && fourth !== undefined) {
            // multireddit: /user/{userName}/m/{multiredditName}
            return [feed(`Reddit Multireddit (${fourth})`, `${url.origin}/user/${second}/m/${fourth}/.rss`)];
        }

        return [feed(`Reddit User (u/${second})`, `${url.origin}/user/${second}/.rss`)];
    }

    return [];
};

export const redditDetector: SiteDetector = {
    hostnames: ['reddit.com'],
    detect,
};
