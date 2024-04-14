import { Store } from 'redux';
import { DISPATCH_TYPE, FETCH_STATE_TYPE, STATE_TYPE, PATCH_STATE_TYPE } from '../constants';
import { getBrowserAPI } from '../util';
import shallowDiff from '../utils/diff';

// Wraps a Redux store and provides messaging interface for Proxystores
export const wrapStore = (store: Store) => {
    const browserAPI = getBrowserAPI();

    /**
     * Setup for state updates
     */
    const sendMessage = (...args) => {
        const onErrorCallback = () => {
            if (browserAPI.runtime.lastError) {
                // do nothing - errors can be present
                // if no content script exists on receiver
            }
        };

        browserAPI.runtime.sendMessage(...args, onErrorCallback);
        // broadcast state changes to all tabs to sync state across content scripts
        return browserAPI.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                browserAPI.tabs.sendMessage(tab.id, ...args, onErrorCallback);
            }
        });
    };

    let currentState = store.getState();

    const patchState = () => {
        const newState = store.getState();
        const diff = shallowDiff(currentState, newState);

        if (diff.length) {
            currentState = newState;

            sendMessage({
                type: PATCH_STATE_TYPE,
                payload: diff,
            });
        }
    };

    // Send patched state down connected port on every redux store state change
    store.subscribe(patchState);

    // Send store's initial state through port
    sendMessage({
        type: STATE_TYPE,
        payload: currentState,
    });

    /**
     * State provider for content-script initialization
     */
    browserAPI.runtime.onMessage.addListener((request, _, sendResponse) => {
        const state = store.getState();

        if (request.type === FETCH_STATE_TYPE) {
            sendResponse({
                type: FETCH_STATE_TYPE,
                payload: state,
            });
        }
    });

    // Respond to dispatch from content-scripts
    browserAPI.runtime.onMessage.addListener((request, _, sendResponse) => {
        // TODO typings for message types // Request/Response
        if (request.type === DISPATCH_TYPE) {
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
