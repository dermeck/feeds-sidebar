import { UnknownAction } from '@reduxjs/toolkit';

export const enum MessageType {
    // proxy => background
    DispatchAction = 'msg-dispatch',
    GetFullStateRequest = 'msg-request-state', // content script initialized
    // background => proxy
    GetFullStateResponse = 'msg-full-state',
    PatchState = 'msg-patch-state',
}

export type DispatchRequest = {
    type: MessageType.DispatchAction;
    action: UnknownAction;
};
