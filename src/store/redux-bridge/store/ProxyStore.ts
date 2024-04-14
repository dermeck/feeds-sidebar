import shallowDiff from '../utils/patch';
import { getBrowserAPI } from '../util'; // TODO mr remove
import { UnknownAction } from '@reduxjs/toolkit';
import { MessageType } from '../messaging/message';

class ProxyStore {
    readyResolved;
    readyPromise;
    readyResolve;
    browserAPI;
    sendMessage;
    listeners;
    state;
    [Symbol.observable];

    constructor() {
        console.log('Proxy constructor');
        this.readyResolved = false;
        this.readyPromise = new Promise((resolve) => (this.readyResolve = resolve));

        this.browserAPI = getBrowserAPI();
        this.processMessage = this.processMessage.bind(this);

        this.browserAPI.runtime.onMessage.addListener(this.processMessage);
        this.sendMessage = (...args) => this.browserAPI.runtime.sendMessage(...args);

        this.listeners = [];
        this.state = {};

        // init store
        this.sendMessage({ type: MessageType.GetFullStateRequest }, undefined, this.processMessage); // TODO figure out why we need to add cb
        // this.browserAPI.runtime.sendMessage({ type: MessageType.RequestState }, undefined, this.initializeStore);

        this.dispatch = this.dispatch.bind(this); // add this context to dispatch
        this.getState = this.getState.bind(this); // add this context to getState
        this.subscribe = this.subscribe.bind(this); // add this context to subscribe
    }

    /**
     * Returns a promise that resolves when the store is ready. Optionally a callback may be passed in instead.
     * @param [function] callback An optional callback that may be passed in and will fire when the store is ready.
     * @return {object} promise A promise that resolves when the store has established a connection with the background page.
     */
    ready(cb = null) {
        if (cb !== null) {
            return this.readyPromise.then(cb);
        }

        return this.readyPromise;
    }

    /**
     * Subscribes a listener function for all state changes
     * @param  {function} listener A listener function to be called when store state changes
     * @return {function}          An unsubscribe function which can be called to remove the listener from state updates
     */
    subscribe(listener) {
        this.listeners.push(listener);

        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    /**
     * Replaces the state for only the keys in the updated state. Notifies all listeners of state change.
     * @param {object} state the new (partial) redux state
     */
    patchState(difference) {
        this.state = shallowDiff(this.state, difference);
        this.listeners.forEach((l) => l());
    }

    /**
     * Replace the current state with a new state. Notifies all listeners of state change.
     * @param  {object} state The new state for the store
     */
    replaceState(state) {
        this.state = state;

        this.listeners.forEach((l) => l());
    }

    /**
     * Get the current state of the store
     * @return {object} the current store state
     */
    getState() {
        return this.state;
    }

    /**
     * Stub function to stay consistent with Redux Store API. No-op.
     */
    replaceReducer() {
        return;
    }

    /**
     * Dispatch an action to the background using messaging passing
     * @param  {object} data The action data to dispatch
     * @return {Promise}     Promise that will resolve/reject based on the action response from the background
     */
    dispatch(action: UnknownAction) {
        return new Promise((resolve, reject) => {
            const cb = (resp) => {
                if (!resp) {
                    const error = this.browserAPI.runtime.lastError;
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

            this.sendMessage(
                {
                    type: MessageType.DispatchAction,
                    action,
                },
                null,
                cb,
            );
        });
    }

    processMessage(message) {
        console.log('Proxy process message', message);
        switch (message.type) {
            case MessageType.GetFullStateResponse:
                this.replaceState(message.payload);

                if (!this.readyResolved) {
                    this.readyResolved = true;
                    this.readyResolve();
                }
                break;

            case MessageType.PatchState:
                this.patchState(message.payload);
                break;

            default:
            // do nothing
        }
    }
}

export { ProxyStore };
