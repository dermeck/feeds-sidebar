import { Store, UnknownAction } from 'redux';
import {
    BackgroundScriptMessage,
    MessageType,
    addMessageListener,
    sendMessageToBackgroundScript,
} from '../messaging/message';
import shallowDiff from '../utils/patch'; // TODO refactor

// Creates a proxy store that interacts with the real Redux store in the background script via messages
export function createProxyStore(): { storePromise: Promise<Store> } {
    let state = {};
    let listeners: (() => void)[] = [];

    // TODO enable no implicit any
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
        console.log('Proxy process message', message);

        switch (message.type) {
            case MessageType.GetFullStateResponse:
                replaceState(message.payload);
                break;

            case MessageType.PatchState:
                patchState(message.payload);
                break;
            default:
            // do nothing
        }
    }

    function replaceState(newState) {
        state = newState;
        listeners.forEach((l) => l());
    }

    function patchState(difference) {
        state = shallowDiff(state, difference);
        listeners.forEach((l) => l());
    }

    function replaceReducer() {
        return;
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

    const store = {
        dispatch: dispatch,
        subscribe,
        getState: () => state,
        replaceReducer,
        [Symbol.observable]: undefined,
    } as unknown as Store<unknown, UnknownAction, unknown>; // TODO fix type?

    return { storePromise };
}
