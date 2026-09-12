import React, { ReactNode, useMemo } from 'react';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import feedsSlice from '../store/slices/feeds';
import optionsSlice from '../store/slices/options';
import sessionSlice from '../store/slices/session';
import { RootState } from '../store/store';

const rootReducer = combineReducers({
    feeds: feedsSlice.reducer,
    options: optionsSlice.reducer,
    session: sessionSlice.reducer,
});

/**
 * Store for stories: same reducers as the extension store but without sagas,
 * persistence and the middleware that talks to the WebExtension apis.
 */
export const createMockStore = (preloadedState?: Partial<RootState>) =>
    configureStore({
        reducer: rootReducer,
        preloadedState,
    });

export const MockStoreProvider = ({
    preloadedState,
    children,
}: {
    preloadedState?: Partial<RootState>;
    children: ReactNode;
}) => {
    const store = useMemo(() => createMockStore(preloadedState), [preloadedState]);

    return <Provider store={store}>{children}</Provider>;
};
