import { DISPATCH_TYPE, FETCH_STATE_TYPE, STATE_TYPE, PATCH_STATE_TYPE } from '../constants';
import { getBrowserAPI } from '../util';
import shallowDiff from '../strategies/shallowDiff/diff';

/**
 * Responder for promisified results
 * @param  {object} dispatchResult The result from `store.dispatch()`
 * @param  {function} send         The function used to respond to original message
 * @return {undefined}
 */
const promiseResponder = (dispatchResult, send) => {
    Promise.resolve(dispatchResult)
        .then((res) => {
            send({
                error: null,
                value: res,
            });
        })
        .catch((err) => {
            console.error('error dispatching result:', err);
            send({
                error: err.message,
                value: null,
            });
        });
};

const defaultOpts = {
    dispatchResponder: promiseResponder,
    diffStrategy: shallowDiff,
};

/**
 * Wraps a Redux store so that proxy stores can connect to it.
 * @param {Object} store A Redux store
 * @param {Object} options An object of form {dispatchResponder, serializer, deserializer}, where `portName` is a required string and defines the name of the port for state transition changes, `dispatchResponder` is a function that takes the result of a store dispatch and optionally implements custom logic for responding to the original dispatch message,`serializer` is a function to serialize outgoing message payloads (default is passthrough), `deserializer` is a function to deserialize incoming message payloads (default is passthrough), and diffStrategy is one of the included diffing strategies (default is shallow diff) or a custom diffing function.
 */
export default (
    store,
    { dispatchResponder = defaultOpts.dispatchResponder, diffStrategy = defaultOpts.diffStrategy } = defaultOpts,
) => {
    const browserAPI = getBrowserAPI();

    /**
     * Respond to dispatches from UI components
     */
    const dispatchResponse = (request, sender, sendResponse) => {
        if (request.type === DISPATCH_TYPE) {
            const action = Object.assign({}, request.payload, {
                _sender: sender,
            });

            let dispatchResult: unknown = null;

            try {
                dispatchResult = store.dispatch(action);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                dispatchResult = Promise.reject(e.message);
                console.error(e);
            }

            dispatchResponder(dispatchResult, sendResponse);
            return true;
        }
    };

    /**
     * Setup for state updates
     */
    const serializedMessagePoster = (...args) => {
        const onErrorCallback = () => {
            if (browserAPI.runtime.lastError) {
                // do nothing - errors can be present
                // if no content script exists on receiver
            }
        };

        browserAPI.runtime.sendMessage(...args, onErrorCallback);
        // We will broadcast state changes to all tabs to sync state across content scripts
        return browserAPI.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                browserAPI.tabs.sendMessage(tab.id, ...args, onErrorCallback);
            }
        });
    };

    let currentState = store.getState();

    const patchState = () => {
        const newState = store.getState();
        const diff = diffStrategy(currentState, newState);

        if (diff.length) {
            currentState = newState;

            serializedMessagePoster({
                type: PATCH_STATE_TYPE,
                payload: diff,
            });
        }
    };

    // Send patched state down connected port on every redux store state change
    store.subscribe(patchState);

    // Send store's initial state through port
    serializedMessagePoster({
        type: STATE_TYPE,
        payload: currentState,
    });

    const withPayloadDeserializer = (payload) => payload;
    const shouldDeserialize = (request) => request.type === DISPATCH_TYPE;

    /**
     * State provider for content-script initialization
     */
    browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const state = store.getState();

        if (request.type === FETCH_STATE_TYPE) {
            sendResponse({
                type: FETCH_STATE_TYPE,
                payload: state,
            });
        }
    });

    /**
     * Setup action handler
     */
    withPayloadDeserializer((...args) => browserAPI.runtime.onMessage.addListener(...args))(dispatchResponse);

    /**
     * Setup external action handler
     */
    if (browserAPI.runtime.onMessageExternal) {
        (...args) => browserAPI.runtime.onMessageExternal.addListener(...args)(dispatchResponse, shouldDeserialize);
    } else {
        console.warn('runtime.onMessageExternal is not supported');
    }
};
