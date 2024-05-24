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

    sendMessageToBackgroundScript({ type: MessageType.FeedsDetected, feeds: feeds });

    // console.log('feeds', feeds);

    // TODO mr dispatch?
    /*
    browser.runtime
        .sendMessage({
            type: 'moep',
            feeds: feeds,
        })
        .catch(() => {});
        */
}

// background-script detects tab reload and notifies us
addMessageListener(processMessage);

// TODO mr add the popup => analyze state in background script (welche schon geaddet sind/ welche nicht) => sieht gut aus!
// dann von hier aus dispatch messages verwenden?

// TODO mayby only show this, when we open the NewFeed view or have it open
// detectFeeds();
