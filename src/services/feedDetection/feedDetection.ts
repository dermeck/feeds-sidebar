import { detectFeedsInLinks } from './links/feedDetectionLinks';
import { siteDetectors } from './sites/siteDetectors';

export type DetectedFeed = {
    type: string;
    href: string;
    title: string;
};

export type SiteDetector = {
    // detector is applied when one of the hostnames matches the hostname of the current page (with or without 'www.')
    hostnames: ReadonlyArray<string>;
    detect: (url: URL) => DetectedFeed[];
};

const normalizeHostname = (hostname: string) => hostname.toLowerCase().replace(/^www\./, '');

// feeds detected by different detectors can point to the same resource with slightly different urls
const deduplicationKey = (href: string): string => {
    try {
        const url = new URL(href);
        return `${url.protocol}//${normalizeHostname(url.hostname)}${url.pathname.replace(/\/$/, '')}${url.search}`;
    } catch {
        return href;
    }
};

const detectFeedsForSite = (url: URL): DetectedFeed[] => {
    const hostname = normalizeHostname(url.hostname);

    return siteDetectors
        .filter((detector) => detector.hostnames.some((x) => hostname === x || hostname.endsWith(`.${x}`)))
        .flatMap((detector) => detector.detect(url));
};

const parseUrl = (href: string): URL | undefined => {
    try {
        return new URL(href);
    } catch {
        return undefined;
    }
};

export function detectFeeds(): DetectedFeed[] {
    const url = parseUrl(document.URL);
    const detectedFeeds = [...detectFeedsInLinks(), ...(url === undefined ? [] : detectFeedsForSite(url))];

    const deduplicatedDetectedFeeds = new Map<string, DetectedFeed>();
    detectedFeeds.forEach((x) => {
        const key = deduplicationKey(x.href);
        if (!deduplicatedDetectedFeeds.has(key)) {
            deduplicatedDetectedFeeds.set(key, x);
        }
    });

    return [...deduplicatedDetectedFeeds.values()];
}
