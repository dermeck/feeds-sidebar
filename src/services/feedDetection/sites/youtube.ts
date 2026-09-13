import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const CHANNEL_ID_PATTERN = /^UC[\w-]{22}$/;

const channelFeed = (channelId: string): DetectedFeed => ({
    title: 'YouTube Channel',
    href: `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    type: 'rss',
});

// on pages that do not contain the channel id in their url (/watch, /@handle, /c/name, /user/name)
// youtube renders it into meta tags of the document
const channelIdFromDocument = (): string | undefined => {
    const metaTags: HTMLMetaElement[] = Array.from(
        document.querySelectorAll('meta[itemprop="identifier"], meta[itemprop="channelId"]'),
    );

    return metaTags.map((x) => x.content).find((x) => CHANNEL_ID_PATTERN.test(x));
};

const detect = (url: URL): DetectedFeed[] => {
    const feeds: DetectedFeed[] = [];
    const segments = pathSegments(url);
    const playListId = url.searchParams.get('list');

    if (playListId) {
        feeds.push({
            title: 'YouTube Playlist',
            href: `https://www.youtube.com/feeds/videos.xml?playlist_id=${playListId}`,
            type: 'rss',
        });
    }

    const channelSegmentIndex = segments.indexOf('channel');
    const channelIdFromUrl = channelSegmentIndex === -1 ? undefined : segments[channelSegmentIndex + 1];
    const channelId = channelIdFromUrl ?? channelIdFromDocument();

    if (channelId !== undefined && CHANNEL_ID_PATTERN.test(channelId)) {
        feeds.push(channelFeed(channelId));
    }

    return feeds;
};

export const youtubeDetector: SiteDetector = {
    hostnames: ['youtube.com', 'youtu.be'],
    detect,
};
