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
      items: [],
    },*/
    {
      // sample RSS 2.0 Feed
      url: "https://www.tagesschau.de/xml/rss2/",
      items: [],
    },
    {
      // sample Youtube Feed (Atom)
      url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA",
      items: [],
    },
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
      state.feeds = updateFeed(state, action.payload);
    },
  },
});

const updateFeed = (state: FeedSliceState, updatedFeed: Feed) =>
  state.feeds.map((feed) => {
    if (feed.url !== updatedFeed.url) {
      return feed;
    }

    return {
      ...feed,
      ...updatedFeed,
    };
  });

export default feedsSlice;
