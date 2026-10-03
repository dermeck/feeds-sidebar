import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const RESERVED_SEGMENTS = ['about', 'become-a-member', 'blog', 'careers', 'contact', 'faq', 'membership', 'press', 'pricing', 'search', 'sign-in', 'sign-up', 'tag', 'tos'];

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'rss' });

const detect = (url: URL): DetectedFeed[] => {
    const segments = pathSegments(url);

    if (segments.includes('feed')) {
        return [];
    }

    // https://{handle}.medium.com[/post-slug]
    if (url.hostname !== 'medium.com' && url.hostname !== 'www.medium.com') {
        const handle = url.hostname.replace(/\.medium\.com$/, '');

        return [feed(`Medium (${handle})`, `https://medium.com/feed/${handle}`)];
    }

    if (segments.length === 0) {
        return [];
    }

    const [first, second, third] = segments;

    // https://medium.com/feed/tag/{tag}
    if (first === 'tag' && second !== undefined) {
        return [feed(`Medium Tag (${second})`, `${url.origin}/feed/tag/${second}`)];
    }

    // https://medium.com/{publication}/tagged/{tag}
    if (second === 'tagged' && third !== undefined) {
        return [feed(`Medium ${first} Tag (${third})`, `${url.origin}/feed/${first}/tagged/${third}`)];
    }

    const name = first.startsWith('@') ? first.substring(1) : first;

    if (name === '' || RESERVED_SEGMENTS.includes(name.toLowerCase())) {
        return [];
    }

    return [feed(`Medium ${first.startsWith('@') ? 'Profile' : 'Publication'} (${name})`, `${url.origin}/feed/${name}`)];
};

export const mediumDetector: SiteDetector = {
    hostnames: ['medium.com'],
    detect,
};