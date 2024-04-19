import { Store } from 'redux';
import { shallowDiff } from '../utils/changeUtils';
import { MessageType, addMessageListener, sendMessageToContentScripts } from '../messaging/message';

// Wraps a Redux store and provides messaging interface for proxy store
export const wrapStore = (store: Store) => {
    let messagingActive = false;
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
            sendMessageToContentScripts({
                type: MessageType.PatchState,
                payload: diff,
            });
        }
    };

    store.subscribe(onStoreChanged);

    addMessageListener((request) => {
        messagingActive = true;

        // Provide state for content-script initialization
        if (request.type === MessageType.GetFullStateRequest) {
            return Promise.resolve({
                type: MessageType.GetFullStateResponse,
                payload: store.getState(),
            });
        }

        if (request.type === MessageType.DispatchAction) {
            // Forward dispatch from content-script
            return store.dispatch(request.action);
        }
    });
};
