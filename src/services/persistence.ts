import { initialState as initialSessionSliceState } from '../store/slices/session';
import { RootState } from '../store/store';

const storageKeys = {
    feeds: 'feedsKey',
    options: 'optionsKey',
    timestamp: 'timestampKey',
};

export const saveState = (state: RootState): Promise<void> => {
    const localStorageData = {
        [storageKeys.feeds]: state.feeds,
        [storageKeys.options]: state.options,
        [storageKeys.timestamp]: Date.now(),
    };

    return browser.storage.local.set(localStorageData);
};

export const loadState = async (): Promise<(RootState & { timestamp: number }) | undefined> => {
    const feeds = await browser.storage.local.get(storageKeys.feeds);
    const options = await browser.storage.local.get(storageKeys.options);
    const timestamp = await browser.storage.local.get(storageKeys.timestamp);

    const loadedFeeds = feeds[storageKeys.feeds];
    const loadedOptions = options[storageKeys.options];

    if (
        typeof loadedFeeds !== 'object' ||
        loadedFeeds === null ||
        !Array.isArray(loadedFeeds.feeds) ||
        !Array.isArray(loadedFeeds.folders)
    ) {
        return undefined;
    }

    if (typeof loadedOptions !== 'object' || loadedOptions === null) {
        return undefined;
    }

    return {
        feeds: loadedFeeds as RootState['feeds'],
        options: loadedOptions as RootState['options'],
        session: initialSessionSliceState,
        timestamp: Number(timestamp.timestampKey),
    };
};
