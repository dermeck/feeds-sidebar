import { detectFeedsInLinks } from './links/feedDetectionLinks';
import { detectFeedsYoutube } from './youtube/feedDetectionYoutube';

export type DetectedFeed = {
    type: string;
    href: string;
    title: string;
};

export function detectFeeds(): DetectedFeed[] {
    const detectedFeeds = [...detectFeedsInLinks(), ...detectFeedsYoutube()];

    const deduplicatedDetectedFeeds = new Map<string, DetectedFeed>();
    detectedFeeds.forEach((x) => {
        deduplicatedDetectedFeeds.set(x.href, x);
    });

    return [...deduplicatedDetectedFeeds.values()];
}
