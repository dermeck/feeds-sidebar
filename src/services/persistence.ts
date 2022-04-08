import { FeedSliceState } from '../store/slices/feeds';
import { OptionsSliceState } from '../store/slices/options';
import { initialState as initialSessionSliceState } from '../store/slices/session';
import { RootState } from '../store/store';

const storageKeys = {
    feeds: 'feedsKey',
    options: 'optionsKey',
};

export const saveState = (state: RootState): Promise<void> => {
    const localStorageData = {
        [storageKeys.feeds]: state.feeds,
        [storageKeys.options]: state.options,
    };

    return browser.storage.local.set(localStorageData);
};

export const loadState = async (): Promise<RootState | undefined> => {
    const feeds = await browser.storage.local.get(storageKeys.feeds);
    const options = await browser.storage.local.get(storageKeys.options);

    if (Object.keys(feeds).length === 0 || Object.keys(options).length === 0) {
        return undefined;
    }

    return {
        feeds: feeds.feedsKey as FeedSliceState,
        options: options.optionsKey as OptionsSliceState,
        session: initialSessionSliceState,
    };
};
