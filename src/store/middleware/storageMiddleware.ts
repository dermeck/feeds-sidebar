import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { initCommand } from '../slices/global';
import store, { RootState } from '../store';

export const storageMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    ThunkDispatch<RootState, undefined, AnyAction>
> = (middlewareApi) => (next) => (action) => {
    if (initCommand.match(action)) {
        // initial load from local storage

        // setup persistence
        store.subscribe(() => console.log('storeChanged!'));
    }

    return next(action);
};
