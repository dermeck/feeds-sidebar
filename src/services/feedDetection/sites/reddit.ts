import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const SORT_SEGMENTS = ['hot', 'new', 'top', 'rising', 'controversial'];

const RESERVED_SEGMENTS = ['chat', 'login', 'messages', 'premium', 'register', 'settings'];

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'atom' });

const detect = (url: URL): DetectedFeed[] => {
    const segments = pathSegments(url);

    if (segments.some((segment) => segment.endsWith('.rss'))) {
        return [];
    }

    const [first, second, third, fourth] = segments;

    if (first === undefined) {
        return [feed('Reddit Frontpage', `${url.origin}/.rss`)];
    }

    if (RESERVED_SEGMENTS.includes(first.toLowerCase())) {
        return [];
    }

    if (first === 'r' && second !== undefined) {
        if (third === 'comments' && fourth !== undefined) {
            return [feed(`Reddit Post (r/${second})`, `${url.origin}/r/${second}/comments/${fourth}/.rss`)];
        }

        const sort = third !== undefined && SORT_SEGMENTS.includes(third) ? third : undefined;

        return sort === undefined
            ? [feed(`Reddit r/${second}`, `${url.origin}/r/${second}/.rss`)]
            : [feed(`Reddit r/${second} (${sort})`, `${url.origin}/r/${second}/${sort}/.rss`)];
    }

    if ((first === 'user' || first === 'u') && second !== undefined) {
        if (third === 'm' && fourth !== undefined) {
            return [feed(`Reddit Multireddit (${fourth})`, `${url.origin}/user/${second}/m/${fourth}/.rss`)];
        }

        return [feed(`Reddit User (u/${second})`, `${url.origin}/user/${second}/.rss`)];
    }

    if (first === 'search' || first === 'domain') {
        return [feed(`Reddit ${first}`, `${url.origin}/${segments.join('/')}.rss${url.search}`)];
    }

    return [];
};

export const redditDetector: SiteDetector = {
    hostnames: ['reddit.com'],
    detect,
};