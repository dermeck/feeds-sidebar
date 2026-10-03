import { initialState as initialSessionSliceState } from '../store/slices/session';
import { RootState } from '../store/store';

const storageKeys = {
    feeds: 'feedsKey',
    options: 'optionsKey',
    timestamp: 'timestampKey',
    readItemIds: 'readItemIdsKey',
};

export const saveState = (state: RootState): Promise<void> => {
    const localStorageData = {
        [storageKeys.feeds]: state.feeds,
        [storageKeys.options]: state.options,
        [storageKeys.timestamp]: Date.now(),
        [storageKeys.readItemIds]: state.feeds.readItemIds,
    };

    return browser.storage.local.set(localStorageData);
};

export const loadState = async (): Promise<(RootState & { timestamp: number }) | undefined> => {
    const feeds = await browser.storage.local.get(storageKeys.feeds);
    const options = await browser.storage.local.get(storageKeys.options);
    const timestamp = await browser.storage.local.get(storageKeys.timestamp);
    const readItemIds = await browser.storage.local.get(storageKeys.readItemIds);

    const loadedFeeds = feeds[storageKeys.feeds];
    const loadedOptions = options[storageKeys.options];
    const loadedReadItemIds = readItemIds[storageKeys.readItemIds];

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
        feeds: {
            ...loadedFeeds,
            readItemIds: Array.isArray(loadedReadItemIds) ? loadedReadItemIds : [],
        } as RootState['feeds'],
        options: loadedOptions as RootState['options'],
        session: initialSessionSliceState,
        timestamp: Number(timestamp.timestampKey) || Date.now(),
    };
};
