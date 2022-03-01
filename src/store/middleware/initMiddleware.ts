import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { loadState, saveState } from '../../services/persistence';
import { initCommand } from '../actions';
import { fetchFeedsCommand } from '../slices/feeds';
import store, { RootState } from '../store';

const feedsAutoUpdateKey = 'feedsAutoUpdate';

export const initMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    ThunkDispatch<RootState, undefined, AnyAction>
> = (middlewareApi) => (next) => async (action) => {
    if (initCommand.match(action)) {
        // initial load from local storage
        const loadedState = await loadState();

        if (loadedState !== undefined) {
            middlewareApi.dispatch(fetchFeedsCommand(loadedState.feeds.feeds.map((x) => x.url)));
        }

        // setup persistence
        store.subscribe(async () => {
            await saveState(store.getState());
        });

        // setup cyclic update of all feeds
        const state = middlewareApi.getState();
        browser.alarms.create(feedsAutoUpdateKey, { periodInMinutes: state.options.feedUpdatePeriodInMinutes });
        browser.alarms.onAlarm.addListener(() =>
            middlewareApi.dispatch(fetchFeedsCommand(state.feeds.feeds.map((x) => x.url))),
        );
    }

    return next(action);
};
