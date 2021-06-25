import {
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export type FeedSliceState = {
  feeds: ReadonlyArray<Feed>;
};

interface Feed {
  url: string;
  title?: string;
}

export const fetchAllFeedsCommand = createAction("feeds/fetchAllFeedsCommand");

const initialState: FeedSliceState = { feeds: [] };

export const fetchFeedByUrl = createAsyncThunk<string, string>(
  "feeds/fetchByUrl",
  async (url) => {
    console.log("fetch", url);
    const response = await fetch(url);
    console.log(response);
    return await response.text();
  }
);

const feedsSlice = createSlice({
  name: "feeds",
  initialState,
  reducers: {
    addFeed(state, action: PayloadAction<string>) {
      console.log(action.type);
      state.feeds.push({ url: action.payload });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeedByUrl.fulfilled, (state, action) => {
      console.log("fetched...", action);
    });
  },
});

export default feedsSlice;
