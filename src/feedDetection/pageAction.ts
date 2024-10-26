import {
    BackgroundScriptMessage,
    MessageType,
    addMessageListener,
    sendMessageToBackgroundScript,
} from '../store/reduxBridge/messaging';

function filterLink(link: HTMLLinkElement) {
    const LINK_TYPES = ['application/rss+xml', 'application/atom+xml'];
    return LINK_TYPES.includes(link.type);
}

function mapLink(link: HTMLLinkElement) {
    const { type, href, title = link.href } = link;
    return { type, href, title };
}

function detectFeeds(): DetectedFeeds {
    const QUERY = 'link[rel="alternate"][type]';
    const LINKS: HTMLLinkElement[] = Array.from(document.querySelectorAll(QUERY));

    const feedLinks = LINKS.filter(filterLink).map(mapLink);
    return feedLinks.length > 0 ? feedLinks : [];
}

export type DetectedFeeds = {
    type: string;
    href: string;
    title: string;
}[];

function processMessage(message: BackgroundScriptMessage) {
    if (message.type !== MessageType.StartFeedDetection) {
        return;
    }

    const feeds = detectFeeds();

    sendMessageToBackgroundScript({
        type: MessageType.FeedsDetected,
        payload: { url: message.payload.url, feeds: feeds },
    });
}

// background-script detects tab reload and notifies us
addMessageListener(processMessage);

// TODO add Popup with detected feeds
