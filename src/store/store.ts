import { configureStore } from '@reduxjs/toolkit';

import { feedMiddleware } from './middleware/feedMiddleware';
import { initMiddleware } from './middleware/initMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import feedsSlice, { FeedSliceState } from './slices/feeds';
import optionsSlice, { OptionsSliceState } from './slices/options';
import sessionSlice, { SessionSliceState } from './slices/session';

const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(loggerMiddleware).concat([initMiddleware, feedMiddleware]),
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
