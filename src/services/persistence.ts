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

    if (Object.keys(feeds).length === 0 || Object.keys(options).length === 0) {
        return undefined;
    }

    return {
        feeds: feeds.feedsKey as RootState['feeds'],
        options: options.optionsKey as RootState['options'],
        session: initialSessionSliceState,
        timestamp: Number(timestamp.timestampKey),
    };
};
