import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { loadState, saveState } from '../../services/persistence';
import feedsSlice, { fetchFeedByUrl } from '../slices/feeds';
import { initCommand } from '../slices/global';
import store, { RootState } from '../store';

const feedsAutoUpdateKey = 'feedsAutoUpdate';

export const storageMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    ThunkDispatch<RootState, undefined, AnyAction>
> = (middlewareApi) => (next) => async (action) => {
    if (initCommand.match(action)) {
        // initial load from local storage
        const loadedState = await loadState();

        if (loadedState !== undefined) {
            middlewareApi.dispatch(feedsSlice.actions.extensionStateLoaded(loadedState.feeds));
        }

        // setup persistence
        store.subscribe(async () => {
            await saveState(store.getState());
        });

        // setup cyclic update of all feeds
        browser.alarms.create(feedsAutoUpdateKey, { periodInMinutes: 1 });
        browser.alarms.onAlarm.addListener(() =>
            middlewareApi.getState().feeds.feeds.forEach((feed) => {
                middlewareApi.dispatch(fetchFeedByUrl(feed.url));
            }),
        );
    }

    return next(action);
};
