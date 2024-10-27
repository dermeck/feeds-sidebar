import { DetectedFeeds } from '../feedDetection';

// eslint-disable-next-line no-useless-escape
const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/gm;

export const detectFeedsYoutube = (): DetectedFeeds => {
    if (!document.URL || !regex.test(document.URL)) {
        return [];
    }

    /*
    // channel rss is also provided by YT via link
    const urlPathSegments = new URL(document.URL).pathname.split('/').filter(Boolean);
    const channelSegmentIndex = urlPathSegments.findIndex((segment) => segment === 'channel');
    sendMessageToBackgroundScript({
        type: MessageType.LogMessage,
        payload: { message: 'detectFeedsYoutube', data: channelSegmentIndex },
    });

    if (channelSegmentIndex !== -1) {
        // https://www.youtube.com/channel/{channelId}
        const channelId = urlPathSegments[channelSegmentIndex + 1];
        return [
            {
                title: 'Youtube Channel',
                href: `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
                type: 'rss',
            },
        ];
    }
    */

    const urlParams = new URLSearchParams(window.location.search);
    const playListId = urlParams.get('list');

    if (playListId) {
        return [
            {
                title: 'Youtube Playlist',
                href: `https://www.youtube.com/feeds/videos.xml?playlist_id=${playListId}`,
                type: 'rss',
            },
        ];
    }

    return [];
};
