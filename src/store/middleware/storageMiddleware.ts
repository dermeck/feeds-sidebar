import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { loadState, saveState } from '../../services/persistence';
import feedsSlice, { fetchAllFeedsCommand } from '../slices/feeds';
import { initCommand } from '../slices/global';
import store, { RootState } from '../store';

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
    }

    return next(action);
};
