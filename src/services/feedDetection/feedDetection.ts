import { detectFeedsInLinks } from './links/feedDetectionLinks';
import { siteDetectors } from './sites/siteDetectors';

export type DetectedFeed = {
    type: string;
    href: string;
    title: string;
};

export type SiteDetector = {
    hostnames: ReadonlyArray<string>;
    detect: (url: URL) => DetectedFeed[];
};

export const isSameDetectedFeeds = (a: ReadonlyArray<DetectedFeed>, b: ReadonlyArray<DetectedFeed>) =>
    a.length === b.length &&
    a.every((feed, i) => feed.href === b[i].href && feed.title === b[i].title && feed.type === b[i].type);

const normalizeHostname = (hostname: string) => hostname.toLowerCase().replace(/^www\./, '');

/** Keeps the query, so feeds differing only by search are not merged */
const deduplicationKey = (href: string): string => {
    try {
        const url = new URL(href);
        return `${url.protocol}//${normalizeHostname(url.hostname)}${url.pathname.replace(/\/$/, '')}${url.search}`;
    } catch {
        return href;
    }
};

export function detectFeedsForSite(url: URL): DetectedFeed[] {
    const hostname = normalizeHostname(url.hostname);

    return siteDetectors
        .filter((detector) => detector.hostnames.some((x) => hostname === x || hostname.endsWith(`.${x}`)))
        .flatMap((detector) => detector.detect(url));
}

export function parseUrl(input: string): URL | undefined {
    const trimmed = input.trim();
    const hasProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed);
    try {
        return new URL(hasProtocol ? trimmed : `https://${trimmed}`);
    } catch {
        return undefined;
    }
}

export function detectFeeds(): DetectedFeed[] {
    const url = parseUrl(document.URL);
    const detectedFeeds = [...detectFeedsInLinks(), ...(url === undefined ? [] : detectFeedsForSite(url))];

    const deduplicatedDetectedFeeds = new Map<string, DetectedFeed>();
    detectedFeeds.forEach((feed) => {
        const key = deduplicationKey(feed.href);
        if (!deduplicatedDetectedFeeds.has(key)) {
            deduplicatedDetectedFeeds.set(key, feed);
        }
    });

    return [...deduplicatedDetectedFeeds.values()];
}