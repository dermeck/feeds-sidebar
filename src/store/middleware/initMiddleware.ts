import { Dispatch, Middleware } from '@reduxjs/toolkit';

import { loadState, saveState } from '../../services/persistence';
import { extensionStateLoaded, initCommand } from '../actions';
import { fetchAllFeedsCommand, fetchFeedsCommand } from '../slices/feeds';
import store, { RootState } from '../store';

const feedsAutoUpdateKey = 'feedsAutoUpdate';

export const initMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    Dispatch
> = (middlewareApi) => (next) => async (action) => {
    if (initCommand.match(action)) {
        // initial load from local storage
        const loadedState = await loadState();

        if (loadedState !== undefined) {
            middlewareApi.dispatch(extensionStateLoaded(loadedState));
            middlewareApi.dispatch(fetchFeedsCommand(loadedState.feeds.feeds.map((x) => x.id)));
        }

        // setup persistence
        store.subscribe(async () => {
            await saveState(store.getState());
        });

        // setup cyclic update of all feeds
        const state = middlewareApi.getState();
        browser.alarms.create(feedsAutoUpdateKey, { periodInMinutes: state.options.feedUpdatePeriodInMinutes });
        browser.alarms.onAlarm.addListener(() => middlewareApi.dispatch(fetchAllFeedsCommand()));
    }

    return next(action);
};
