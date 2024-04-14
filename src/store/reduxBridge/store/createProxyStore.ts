import { Store, UnknownAction } from 'redux';
import { MessageType } from '../messaging/message';
import shallowDiff from '../utils/patch'; // TODO refactor

// Creates a proxy store that interacts with the real redux store in the background script via messages
export function createProxyStore(): { readyPromise: Promise<unknown>; store: Store } {
    let state = {};
    let listeners: (() => void)[] = [];
    const browserAPI = browser;
    let readyResolved = false;

    // eslint-disable-next-line @typescript-eslint/ban-types
    let resolveReady: Function;
    const readyPromise = new Promise((resolve) => (resolveReady = resolve));

    browserAPI.runtime.onMessage.addListener(processMessage);

    const init = () => {
        sendMessage({ type: MessageType.GetFullStateRequest }, undefined, processMessage);
    };

    function processMessage(message) {
        console.log('Proxy process message', message);
        switch (message.type) {
            case MessageType.GetFullStateResponse:
                replaceState(message.payload);

                if (!readyResolved) {
                    readyResolved = true;
                    resolveReady();
                }
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

    // TODO typings are strange here?
    const sendMessage = (message, a, b) => browserAPI.runtime.sendMessage(message, a, b);

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
        console.log('proxy dispatch', action);
        return new Promise((resolve, reject) => {
            const cb = (resp) => {
                if (!resp) {
                    const error = browserAPI.runtime.lastError;
                    reject(new Error(`error in background script, dispatch response is undefined: ${error}`));
                    return;
                }

                const { error, value } = resp; // TODO improve typings

                if (error) {
                    reject(new Error(`error in background script: ${error}`));
                } else {
                    resolve(value && value.payload);
                }
            };

            sendMessage(
                {
                    type: MessageType.DispatchAction,
                    action,
                },
                null,
                cb,
            );
        });
    }

    init();

    const store = {
        dispatch: dispatch,
        subscribe,
        getState: () => state,
        replaceReducer,
        [Symbol.observable]: undefined,
    } as unknown as Store<unknown, UnknownAction, unknown>; // TODO fix type?

    return { readyPromise, store };
}
