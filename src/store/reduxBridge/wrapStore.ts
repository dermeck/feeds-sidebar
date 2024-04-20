import { Store } from 'redux';
import { shallowDiff } from './utils/changeUtils';
import { ContenScriptMessage, MessageType, addMessageListener, sendMessageToContentScripts } from './messaging';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';

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

        if (diff.updatedProperties.length > 0 || diff.deletedProperties.length > 0) {
            currentState = newState;

            // notify proxy stores
            sendMessageToContentScripts({
                type: MessageType.PatchState,
                payload: diff,
            });
        }
    };

    store.subscribe(onStoreChanged);

    addMessageListener((request: ContenScriptMessage) => {
        messagingActive = true;
        const type = request.type;

        switch (type) {
            case MessageType.GetFullStateRequest:
                // Provide state for content-script initialization
                return Promise.resolve({
                    type: MessageType.GetFullStateResponse,
                    payload: store.getState(),
                });

            case MessageType.DispatchAction:
                // Forward dispatch from content-script
                return store.dispatch(request.action);

            default:
                throw new UnreachableCaseError(type);
        }
    });
};
