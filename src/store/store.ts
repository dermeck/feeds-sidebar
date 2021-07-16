import { configureStore } from '@reduxjs/toolkit';

import { feedMiddleware } from './middleware/feedMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { storageMiddleware } from './middleware/storageMiddleware';
import feedsSlice, { FeedSliceState } from './slices/feeds';

const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(loggerMiddleware).concat([storageMiddleware, feedMiddleware]),
    reducer: {
        feeds: feedsSlice.reducer,
    },
});

export type RootState = {
    feeds: FeedSliceState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
