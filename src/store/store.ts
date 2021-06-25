import { configureStore } from "@reduxjs/toolkit";
import { loggerMiddleware } from "./middleware/loggerMiddleware";
import feedsSlice, { FeedSliceState } from "./slices/feeds";

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
  reducer: {
    feeds: feedsSlice.reducer,
  },
});

export type RootState = {
  feeds: FeedSliceState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
