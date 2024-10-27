import { DetectedFeeds } from '../feedDetection';

const LINK_TYPES = [
    'application/rss+xml',
    'application/atom+xml',
    'application/rdf+xml',
    'application/rss',
    'application/atom',
    'application/rdf',
    'text/rss+xml',
    'text/atom+xml',
    'text/rdf+xml',
    'text/rss',
    'text/atom',
    'text/rdf',
];

const mapLink = (link: HTMLLinkElement) => {
    const { type, href, title = link.href } = link;
    return { type, href, title };
};

export const detectFeedsInLinks = (): DetectedFeeds => {
    const QUERY = 'link[type]';
    const LINKS: HTMLLinkElement[] = Array.from(document.querySelectorAll(QUERY));
    const feedLinks = LINKS.filter((x) => LINK_TYPES.includes(x.type)).map(mapLink);
    return feedLinks.length > 0 ? feedLinks : [];
};
