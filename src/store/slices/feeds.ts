import {
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export type FeedSliceState = {
  feeds: ReadonlyArray<Feed>;
};

export interface Feed {
  url: string;
  items: Array<FeedItem>; // TODO should this be ReadOnlyArray?
  link?: string;
  title?: string;
  id?: string;
}

export interface FeedItem {
  id: string;
  title: string;
  url: string;
  published?: Date;
  lastModified?: Date;
}

export const fetchAllFeedsCommand = createAction("feeds/fetchAllFeedsCommand");

const initialState: FeedSliceState = {
  feeds: [
    {
      // sample Atom Feed
      url: "https://ourworldindata.org/atom.xml",
      items: [],
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
      state.feeds.push({ url: action.payload, items: [] });
    },
    updateFeed(state, action: PayloadAction<Feed>) {
      // update existing feed
      const updatedFeed = state.feeds.find((x) => x.url === action.payload.url);
      const filtered = state.feeds.filter((x) => x.url !== action.payload.url);

      return {
        feeds: [...filtered, { ...updatedFeed, ...action.payload }],
      };
    },
  },
});

export default feedsSlice;
