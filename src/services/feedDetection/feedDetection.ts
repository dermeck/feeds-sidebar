import { detectFeedsInLinks } from './links/feedDetectionLinks';
import { detectFeedsYoutube } from './youtube/feedDetectionYoutube';

export type DetectedFeeds = {
    type: string;
    href: string;
    title: string;
}[];

export function detectFeeds() {
    const detectedFeeds = [...detectFeedsInLinks(), ...detectFeedsYoutube()];

    const deduplicatedDetectedFeeds = new Map();
    detectedFeeds.forEach((x) => {
        deduplicatedDetectedFeeds.set(x.href, x);
    });

    return [...deduplicatedDetectedFeeds.values()];
}
