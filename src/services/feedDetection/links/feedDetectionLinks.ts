import { DetectedFeed } from '../feedDetection';

const LINK_TYPES = [
    'application/rss+xml',
    'application/atom+xml',
    'application/rdf+xml',
    'application/rss',
    'application/atom',
    'application/rdf',
    'application/feed+json',
    'text/rss+xml',
    'text/atom+xml',
    'text/rdf+xml',
    'text/rss',
    'text/atom',
    'text/rdf',
];

// json feeds are often announced as plain json, therefore an additional indicator is required
const JSON_LINK_TYPE = 'application/json';

const isFeedLink = (link: HTMLLinkElement) => {
    const type = link.type.toLowerCase().trim();

    if (LINK_TYPES.includes(type)) {
        return true;
    }

    return type === JSON_LINK_TYPE && link.relList.contains('alternate');
};

const mapLink = (link: HTMLLinkElement): DetectedFeed => ({
    type: link.type,
    href: link.href,
    title: link.title !== '' ? link.title : link.href,
});

export const detectFeedsInLinks = (): DetectedFeed[] => {
    const QUERY = 'link[type]';
    const LINKS: HTMLLinkElement[] = Array.from(document.querySelectorAll(QUERY));

    return LINKS.filter(isFeedLink).map(mapLink);
};
