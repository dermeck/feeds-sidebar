import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const CHANNEL_ID_PATTERN = /^UC[\w-]{22}$/;

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'rss' });

const detect = (url: URL): DetectedFeed[] => {
    const feeds: DetectedFeed[] = [];
    const playListId = url.searchParams.get('list');

    if (playListId !== null && playListId !== '') {
        feeds.push(feed('YouTube Playlist', `https://www.youtube.com/feeds/videos.xml?playlist_id=${playListId}`));
    }

    const channelSegmentIndex = pathSegments(url).indexOf('channel');
    const channelId = channelSegmentIndex === -1 ? undefined : pathSegments(url)[channelSegmentIndex + 1];

    if (channelId !== undefined && CHANNEL_ID_PATTERN.test(channelId)) {
        feeds.push(feed('YouTube Channel', `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`));
    }

    return feeds;
};

export const youtubeDetector: SiteDetector = {
    hostnames: ['youtube.com', 'youtu.be'],
    detect,
};