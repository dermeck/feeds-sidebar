import { detectFeedsInLinks } from './links/feedDetectionLinks';
import { detectFeedsYoutube } from './youtube/feedDetectionYoutube';

export type DetectedFeed = {
    type: string;
    href: string;
    title: string;
};

export const isSameDetectedFeeds = (a: ReadonlyArray<DetectedFeed>, b: ReadonlyArray<DetectedFeed>) =>
    a.length === b.length && a.every((feed, i) => feed.href === b[i].href && feed.title === b[i].title && feed.type === b[i].type);

export function detectFeeds(): DetectedFeed[] {
    const detectedFeeds = [...detectFeedsInLinks(), ...detectFeedsYoutube()];

    const deduplicatedDetectedFeeds = new Map<string, DetectedFeed>();
    detectedFeeds.forEach((x) => {
        deduplicatedDetectedFeeds.set(x.href, x);
    });

    return [...deduplicatedDetectedFeeds.values()];
}
