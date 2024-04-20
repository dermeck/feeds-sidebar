import { createProxyStore } from './createProxyStore';
import { wrapStore } from './wrapStore';
/**
 * Create Redux store in the background-script and wrap it with wrapStore which provides messaging interface to the Redux store.
 *
 * Create proxy store in the content-script with createProxyStore which returns a store object with the same interface as the redux store
 * and uses messaging to sync with the real redux store.
 *
 */
export { createProxyStore, wrapStore };
