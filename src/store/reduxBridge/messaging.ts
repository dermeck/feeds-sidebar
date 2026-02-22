import { UnknownAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Changes } from './utils/changeUtils';
import { DetectedFeed } from '../../services/feedDetection/feedDetection';

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
    LogMessage = 'msg-log',
}

type DispatchRequest = { type: MessageType.DispatchAction; action: UnknownAction };
type GetFullStateRequest = { type: MessageType.GetFullStateRequest };
type GetFullStateResponse = { type: MessageType.GetFullStateResponse; payload: RootState };
type PatchStateMessage = { type: MessageType.PatchState; payload: Changes };
type StartFeedDetectionMessage = { type: MessageType.StartFeedDetection; payload: { url: string } };
type FeedsDetectedMessage = { type: MessageType.FeedsDetected; payload: { url: string; feeds: DetectedFeed[] } };
type LogMessage = { type: MessageType.LogMessage; payload: { message: string; data: unknown } };

export type ContentScriptMessage = DispatchRequest | GetFullStateRequest | PageActionMessage;
export type BackgroundScriptMessage = GetFullStateResponse | PatchStateMessage | StartFeedDetectionMessage;
export type PageActionMessage = FeedsDetectedMessage | LogMessage;

const sendMessage = (message: ContentScriptMessage | BackgroundScriptMessage | PageActionMessage) =>
    browser.runtime.sendMessage(message);
export const sendMessageToBackgroundScript = (message: ContentScriptMessage | PageActionMessage) =>
    sendMessage(message);
export const sendMessageToContentScripts = (message: BackgroundScriptMessage) => sendMessage(message);

export const addMessageListener = (
    cb:
        | ((message: ContentScriptMessage) => void)
        | ((message: BackgroundScriptMessage) => void)
        | ((message: PageActionMessage) => void),
) => browser.runtime.onMessage.addListener(cb);
