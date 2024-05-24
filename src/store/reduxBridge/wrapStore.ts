import { Store } from 'redux';
import { shallowDiff } from './utils/changeUtils';
import { ContenScriptMessage, MessageType, addMessageListener, sendMessageToContentScripts } from './messaging';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';

// Wraps a Redux store and provides messaging interface for proxy store
export const wrapStore = (store: Store, messages: ContenScriptMessage[]) => {
    let currentState = store.getState();

    const onStoreChanged = () => {
        const newState = store.getState();
        const diff = shallowDiff(currentState, newState);

        if (diff.updatedProperties.length > 0 || diff.deletedProperties.length > 0) {
            currentState = newState;

            // notify proxy stores
            sendMessageToContentScripts({
                type: MessageType.PatchState,
                payload: diff,
            }).catch(() => {
                // TODO find better way to solve this then swallowing the error
                // receiving end in content-script not yet ready which happens on initial load
                // but we need this message for proper behavior when background-scrip re-initialized
            });
        }
    };

    const unsubscribe = store.subscribe(onStoreChanged);

    const processmessage = (request: ContenScriptMessage) => {
        const type = request.type;

        switch (type) {
            case MessageType.GetFullStateRequest:
                // Provide state for content-script initialization
                sendMessageToContentScripts({
                    type: MessageType.GetFullStateResponse,
                    payload: store.getState(),
                });
                break;

            case MessageType.DispatchAction:
                // Forward dispatch from content-script
                return store.dispatch(request.action);

            default:
            // throw new UnreachableCaseError(type); // TODO add this again
        }
    };

    // process messages that were received during re-init
    messages.forEach((message) => processmessage(message));

    // setup listener for new messsages
    addMessageListener(processmessage);

    return unsubscribe;
};
