import {
    BackgroundScriptMessage,
    MessageType,
    addMessageListener,
    sendMessageToBackgroundScript,
} from '../store/reduxBridge/messaging';
import { detectFeeds } from './feedDetection';

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
