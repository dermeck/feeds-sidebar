import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SliceState = {
  feeds: ReadonlyArray<Feed>;
};

interface Feed {
  url: string;
}

const initialState: SliceState = { feeds: [] };

const feedsSlice = createSlice({
  name: "feeds",
  initialState,
  reducers: {
    addFeed(state, action: PayloadAction<string>) {
      console.log(action.type);
      state.feeds.push({ url: action.payload });
    },
  },
});

export default feedsSlice;
