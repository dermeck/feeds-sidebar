import { UnknownAction } from '@reduxjs/toolkit';

export const enum MessageType {
    // proxy => background
    DispatchAction = 'msg-dispatch',
    GetFullStateRequest = 'msg-request-state', // content script initialized
    // background => proxy
    GetFullStateResponse = 'msg-full-state',
    PatchState = 'msg-patch-state',
}

type DispatchRequest = { type: MessageType.DispatchAction; action: UnknownAction };
type GeFullStateRequest = { type: MessageType.GetFullStateRequest };
type GeFullStateResponse = { type: MessageType.GetFullStateResponse; payload: unknown };
type PatchStateMessage = { type: MessageType.PatchState; payload: unknown }; // TODO remove unknown

export type ContenScriptMessage = DispatchRequest | GeFullStateRequest;
export type BackgroundScriptMessage = GeFullStateResponse | PatchStateMessage;

const sendMessage = (message: ContenScriptMessage | BackgroundScriptMessage) => browser.runtime.sendMessage(message);
export const sendMessageToBackgroundScript = (message: ContenScriptMessage) => sendMessage(message);
export const sendMessageToContentScripts = (message: BackgroundScriptMessage) => sendMessage(message);

export const addMessageListener = (
    cb: ((message: ContenScriptMessage) => void) | ((message: BackgroundScriptMessage) => void),
) => browser.runtime.onMessage.addListener(cb);
