import { detectFeedsInLinks } from './links/feedDetectionLinks';

export type DetectedFeeds = {
    type: string;
    href: string;
    title: string;
}[];

export function detectFeeds() {
    const result = [...detectFeedsInLinks()];

    return result;
}
