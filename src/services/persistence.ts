import { FeedSliceState } from '../store/slices/feeds';
import { initialState as initialSessionSliceState } from '../store/slices/session';
import { RootState } from '../store/store';

const storageKeys = {
    feeds: 'feedsKey',
};

export const saveState = (state: RootState): Promise<void> => {
    const localStorageData = {
        [storageKeys.feeds]: state.feeds,
    };

    return browser.storage.local.set(localStorageData);
};

export const loadState = async (): Promise<RootState | undefined> => {
    const feeds = await browser.storage.local.get(storageKeys.feeds);

    if (Object.keys(feeds).length === 0) {
        return undefined;
    }

    return {
        session: initialSessionSliceState,
        feeds: feeds.feedsKey as FeedSliceState,
    };
};