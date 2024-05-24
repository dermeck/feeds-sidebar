import { UnknownAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Changes } from './utils/changeUtils';
import { DetectedFeeds } from '../../feedDetection/pageAction';

export const enum MessageType {
    // proxy => background
    DispatchAction = 'msg-dispatch',
    GetFullStateRequest = 'msg-request-state', // content script initialized
    // background => proxy
    GetFullStateResponse = 'msg-full-state',
    PatchState = 'msg-patch-state',
    // background => page
    StartFeedDetection = 'msg-page-start-feed-detection',
    // pageAction => background
    FeedsDetected = 'msg-page-feeds-detected',
}

type DispatchRequest = { type: MessageType.DispatchAction; action: UnknownAction };
type GeFullStateRequest = { type: MessageType.GetFullStateRequest };
type GeFullStateResponse = { type: MessageType.GetFullStateResponse; payload: RootState };
type PatchStateMessage = { type: MessageType.PatchState; payload: Changes };
type StartFeedDetectionMessage = { type: MessageType.StartFeedDetection };
type FeedsDetectedMessage = { type: MessageType.FeedsDetected; feeds: DetectedFeeds };

export type ContenScriptMessage = DispatchRequest | GeFullStateRequest;
export type BackgroundScriptMessage = GeFullStateResponse | PatchStateMessage | StartFeedDetectionMessage;
export type PageActionMessage = FeedsDetectedMessage;

const sendMessage = (message: ContenScriptMessage | BackgroundScriptMessage | PageActionMessage) =>
    browser.runtime.sendMessage(message);
export const sendMessageToBackgroundScript = (message: ContenScriptMessage | PageActionMessage) => sendMessage(message);
export const sendMessageToContentScripts = (message: BackgroundScriptMessage) => sendMessage(message);

export const addMessageListener = (
    cb:
        | ((message: ContenScriptMessage) => void)
        | ((message: BackgroundScriptMessage) => void)
        | ((message: PageActionMessage) => void),
) => browser.runtime.onMessage.addListener(cb);
