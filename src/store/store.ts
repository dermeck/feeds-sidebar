import { configureStore } from "@reduxjs/toolkit";
import feedsSlice from "./slices/feeds";

const store = configureStore({
  reducer: {
    feeds: feedsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
