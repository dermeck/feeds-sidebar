import { configureStore } from '@reduxjs/toolkit';

import createSagaMiddleware from 'redux-saga';

import { rootSaga } from '../sagas';
import { feedMiddleware } from './middleware/feedMiddleware';
import { initMiddleware } from './middleware/initMiddleware';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import feedsSlice, { FeedSliceState } from './slices/feeds';
import optionsSlice, { OptionsSliceState } from './slices/options';
import sessionSlice, { SessionSliceState } from './slices/session';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(loggerMiddleware).concat([initMiddleware, sagaMiddleware, feedMiddleware]),
    reducer: {
        feeds: feedsSlice.reducer,
        options: optionsSlice.reducer,
        session: sessionSlice.reducer,
    },
});

sagaMiddleware.run(rootSaga);

export type RootState = {
    feeds: FeedSliceState;
    options: OptionsSliceState;
    session: SessionSliceState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
