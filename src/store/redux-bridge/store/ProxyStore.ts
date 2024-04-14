import { DISPATCH_TYPE, FETCH_STATE_TYPE, STATE_TYPE, PATCH_STATE_TYPE } from '../constants';
import shallowDiff from '../utils/patch';
import { getBrowserAPI } from '../util'; // TODO mr remove
import { UnknownAction } from '@reduxjs/toolkit';

class ProxyStore {
    readyResolved;
    readyPromise;
    readyResolve;
    browserAPI;
    processMessage;
    sendMessage;
    listeners;
    state;
    [Symbol.observable];

    constructor() {
        this.readyResolved = false;
        this.readyPromise = new Promise((resolve) => (this.readyResolve = resolve));

        this.browserAPI = getBrowserAPI();
        this.initializeStore = this.initializeStore.bind(this);

        // init store
        this.browserAPI.runtime.sendMessage({ type: FETCH_STATE_TYPE }, undefined, this.initializeStore);

        this.processMessage = (message) => this.browserAPI.runtime.onMessage.addListener(message);
        this.sendMessage = (...args) => this.browserAPI.runtime.sendMessage(...args);
        this.listeners = [];
        this.state = {};

        this.processMessage((message) => {
            switch (message.type) {
                case STATE_TYPE:
                case FETCH_STATE_TYPE:
                    this.replaceState(message.payload);

                    if (!this.readyResolved) {
                        this.readyResolved = true;
                        this.readyResolve();
                    }
                    break;

                case PATCH_STATE_TYPE:
                    this.patchState(message.payload);
                    break;

                default:
                // do nothing
            }
        });

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
                    type: DISPATCH_TYPE, // TODO Message type!
                    action,
                },
                null,
                cb,
            );
        });
    }

    initializeStore(message) {
        if (message && message.type === FETCH_STATE_TYPE) {
            this.replaceState(message.payload);

            // Resolve if readyPromise has not been resolved.
            if (!this.readyResolved) {
                this.readyResolved = true;
                this.readyResolve();
            }
        }
    }
}

export { ProxyStore };
