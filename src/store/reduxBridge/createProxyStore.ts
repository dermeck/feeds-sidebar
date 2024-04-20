import { Store, UnknownAction } from 'redux';
import { BackgroundScriptMessage, MessageType, addMessageListener, sendMessageToBackgroundScript } from './messaging';
import { Changes, applyChanges } from './utils/changeUtils';
import { RootState } from '../store';
import { Dispatch } from '@reduxjs/toolkit';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';

// Creates a proxy store that interacts with the real Redux store in the background script via messages
export function createProxyStore(): { storePromise: Promise<Store<RootState>> } {
    let state = {};
    let listeners: (() => void)[] = [];

    addMessageListener(processMessage);

    let resolveStore: () => void;

    // resolved when the store is ready (messaging set up)
    const storePromise = new Promise<Store>((resolve) => {
        resolveStore = () => resolve(store);
    });

    // get full state on init
    sendMessageToBackgroundScript({ type: MessageType.GetFullStateRequest })
        .then((result) => {
            processMessage(result);
            // messaging is established
            resolveStore();
        })
        .catch((reason) => console.error(`Error sending message, reasone: ${reason}`));

    function processMessage(message: BackgroundScriptMessage) {
        const type = message.type;

        switch (type) {
            case MessageType.GetFullStateResponse:
                replaceState(message.payload);
                break;

            case MessageType.PatchState:
                patchState(message.payload);
                break;

            default:
                throw new UnreachableCaseError(type);
        }
    }

    function replaceState(newState: RootState) {
        state = newState;
        listeners.forEach((l) => l());
    }

    function patchState(changes: Changes) {
        state = applyChanges(state, changes);
        listeners.forEach((l) => l());
    }

    function subscribe(listener: () => void) {
        listeners.push(listener);

        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    }

    function dispatch(action: UnknownAction) {
        sendMessageToBackgroundScript({
            type: MessageType.DispatchAction,
            action,
        });
    }

    /* fake implementations to satisfy Redux store typings */
    function fakedReplaceReducer() {
        console.error('replaceReducer is not implemented in proxy store');
        return;
    }

    function fakedObservable() {
        return {
            subscribe() {
                console.error('observable is not implemented in proxy store');
                return { unsubscribe: () => undefined };
            },

            [Symbol.observable]() {
                return this;
            },
        };
    }

    const store = {
        dispatch: dispatch as Dispatch<UnknownAction>,
        subscribe,
        getState: () => state,
        replaceReducer: fakedReplaceReducer,
        [Symbol.observable]: fakedObservable,
    } as unknown as Store<RootState, UnknownAction, unknown>;

    return { storePromise };
}
