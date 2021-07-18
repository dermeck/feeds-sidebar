import { configureStore } from '@reduxjs/toolkit';

import { feedMiddleware } from './middleware/feedMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { storageMiddleware } from './middleware/storageMiddleware';
import feedsSlice, { FeedSliceState } from './slices/feeds';
import sessionSlice, { SessionSliceState } from './slices/session';

const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(loggerMiddleware).concat([storageMiddleware, feedMiddleware]),
    reducer: {
        session: sessionSlice.reducer,
        feeds: feedsSlice.reducer,
    },
});

export type RootState = {
    session: SessionSliceState;
    feeds: FeedSliceState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
