import { Store } from 'redux';
import { getBrowserAPI } from '../util';
import shallowDiff from '../utils/diff';
import { MessageType } from '../messaging/message';

// Wraps a Redux store and provides messaging interface for Proxystores
export const wrapStore = (store: Store) => {
    console.log('wrapStore');
    let messagingActive = false;

    const browserAPI = getBrowserAPI();

    const sendMessage = (message) => {
        browserAPI.runtime.sendMessage(message);
    };

    let currentState = store.getState();

    const onStoreChanged = () => {
        if (!messagingActive) {
            // message receiver not yet set up in proxy store
            return;
        }
        const newState = store.getState();
        const diff = shallowDiff(currentState, newState);

        if (diff.length) {
            currentState = newState;

            // notify proxy stores
            sendMessage({
                type: MessageType.PatchState,
                payload: diff,
            });
        }
    };

    store.subscribe(onStoreChanged);

    browserAPI.runtime.onMessage.addListener((request, _, sendResponse) => {
        messagingActive = true;
        console.log('wrapstore listener');

        // Provide state for content-script initialization
        if (request.type === MessageType.GetFullStateRequest) {
            console.log('send request response');

            const state = store.getState();
            sendResponse({
                type: MessageType.GetFullStateResponse,
                payload: state,
            });
        }

        if (request.type === MessageType.DispatchAction) {
            // Respond to dispatch from content-scripts
            store
                .dispatch(request.action)
                .then((res) => {
                    sendResponse({
                        error: null,
                        value: res,
                    });
                })
                .catch((err) => {
                    console.error('error dispatching result:', err);
                    sendResponse({
                        error: err.message,
                        value: null,
                    });
                });

            return true;
        }
    });
};
