import {
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import parseFeed from "../../services/feedParser";

export type FeedSliceState = {
  feeds: ReadonlyArray<Feed>;
};

export const enum FeedType {
  atom = "atom",
  rss1 = "rss 1.0",
  rss2 = "rss 2.0",
  json = "json",
}

export interface FeedItem {
  title: string;
  url?: string; // TODO make this required
}

export interface Feed {
  url?: string; // TODO make this required
  type?: FeedType;
  title?: string;
  id?: string;
  items?: ReadonlyArray<FeedItem>;
}

export const fetchAllFeedsCommand = createAction("feeds/fetchAllFeedsCommand");

const initialState: FeedSliceState = {
  feeds: [
    {
      // sample Atom Feed
      url: "https://ourworldindata.org/atom.xml",
    },
    /*{
      // sample RSS 1.0 / RDF Feed
      // https://www.w3schools.com/xml/xml_rdf.asp
      url: "https://www.dragonball-multiverse.com/flux.rss.php?lang=en",
    },*/
  ],
};

export const fetchFeedByUrl = createAsyncThunk<string, string>(
  "feeds/fetchByUrl",
  async (url) => {
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
      const parsedFeed = parseFeed(action.payload);
    });
  },
});

export default feedsSlice;
