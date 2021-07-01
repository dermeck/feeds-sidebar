import {
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

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
  url: string;
}

export interface Feed {
  url: string;
  type?: FeedType;
  title?: string;
  id?: string;
  items?: Array<FeedItem>; // TODO should this be ReadOnlyArray?
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
    updateFeed(state, action: PayloadAction<Feed>) {
      // TODO feed should already exist since it was previously added, remove condition after parser works properly
      if (state.feeds.some((x) => x.url === action.payload.url)) {
        // update existing feed
        const updatedFeed = state.feeds.find(
          (x) => x.url === action.payload.url
        );

        const filtered = state.feeds.filter(
          (x) => x.url !== action.payload.url
        );

        return {
          feeds: [...filtered, { ...updatedFeed, ...action.payload }],
        };
      }

      // add feed
      state.feeds.push({
        url: action.payload.url,
        items: action.payload.items,
      });
    },
  },
});

export default feedsSlice;
