import { detectFeedsInLinks } from './links/feedDetectionLinks';
import { detectFeedsYoutube } from './youtube/feedDetectionYoutube';

export type DetectedFeeds = {
    type: string;
    href: string;
    title: string;
}[];

export function detectFeeds() {
    const result = [...detectFeedsInLinks(), ...detectFeedsYoutube()];

    return result;
}
