import { DetectedFeeds } from '../feedDetection';

const mapLink = (link: HTMLLinkElement) => {
    const { type, href, title = link.href } = link;
    return { type, href, title };
};

const filterLink = (link: HTMLLinkElement) => {
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

    return LINK_TYPES.includes(link.type);
};

export const detectFeedsInLinks = (): DetectedFeeds => {
    const QUERY = 'link[rel="alternate"][type]';
    const LINKS: HTMLLinkElement[] = Array.from(document.querySelectorAll(QUERY));
    const feedLinks = LINKS.filter(filterLink).map(mapLink);
    return feedLinks.length > 0 ? feedLinks : [];
};
