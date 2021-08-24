import { configureStore } from '@reduxjs/toolkit';

import { feedMiddleware } from './middleware/feedMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { storageMiddleware } from './middleware/storageMiddleware';
import feedsSlice, { FeedSliceState } from './slices/feeds';
import optionsSlice, { OptionsSliceState } from './slices/options';
import sessionSlice, { SessionSliceState } from './slices/session';

const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(loggerMiddleware).concat([storageMiddleware, feedMiddleware]),
    reducer: {
        feeds: feedsSlice.reducer,
        options: optionsSlice.reducer,
        session: sessionSlice.reducer,
    },
});

export type RootState = {
    feeds: FeedSliceState;
    options: OptionsSliceState;
    session: SessionSliceState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
