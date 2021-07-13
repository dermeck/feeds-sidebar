import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FeedSliceState = {
    feeds: ReadonlyArray<Feed>;
};

export interface Feed {
    id: string;
    url: string;
    items: ReadonlyArray<FeedItem>;
    link?: string;
    title?: string;
}

export interface FeedItem {
    id: string;
    title: string;
    url: string;
    published?: Date;
    lastModified?: Date;
    isRead?: boolean;
}

export const fetchAllFeedsCommand = createAction('feeds/fetchAllFeedsCommand');

const initialState: FeedSliceState = {
    feeds: [
        {
            // sample Atom Feed
            id: 'https://ourworldindata.org/atom.xml',
            url: 'https://ourworldindata.org/atom.xml',
            items: [],
        },
        /*{
      // sample RSS 1.0 / RDF Feed
      // https://www.w3schools.com/xml/xml_rdf.asp
      url: "https://www.dragonball-multiverse.com/flux.rss.php?lang=en",
      items: [],
    },*/
        /*{
      // sample RSS 2.0 Feed
      id: "https://www.tagesschau.de/xml/rss2/",
      url: "https://www.tagesschau.de/xml/rss2/",
      items: [],
    },
    {
      // sample Youtube Feed (Atom)
      id: "https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA",
      url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA",
      items: [],
    },*/
    ],
};

export const fetchFeedByUrl = createAsyncThunk<string, string>('feeds/fetchByUrl', async (url) => {
    const response = await fetch(url);
    return await response.text();
});

const feedsSlice = createSlice({
    name: 'feeds',
    initialState,
    reducers: {
        addFeed(state, action: PayloadAction<string>) {
            state.feeds.push({ id: action.payload, url: action.payload, items: [] });
        },
        updateFeed(state, action: PayloadAction<Feed>) {
            return {
                feeds: [...updateFeed(state, action.payload)],
            };
        },
        itemRead(state, action: PayloadAction<{ feedId: string; itemId: string }>) {
            return {
                feeds: [...markItemAsRead(state, action.payload.feedId, action.payload.itemId)],
            };
        },
    },
});

const updateFeed = (state: FeedSliceState, updatedFeed: Feed): ReadonlyArray<Feed> =>
    state.feeds.map((feed) => {
        if (feed.url !== updatedFeed.url) {
            return feed;
        }

        return {
            ...mergeFeed(feed, updatedFeed),
        };
    });

const mergeFeed = (previous: Feed, updatedFeed: Feed): Feed => {
    const newItems = updatedFeed.items.filter((item) => {
        if (previous.items.some((x) => x.id === item.id)) {
            return;
        } else {
            return item;
        }
    });

    return {
        id: updatedFeed.id,
        url: updatedFeed.url,
        title: previous.title !== '' ? previous.title : updatedFeed.title,
        link: updatedFeed.link,
        items: [...previous.items, ...newItems],
    };
};

const markItemAsRead = (state: FeedSliceState, feedId: string, itemId: string) =>
    state.feeds.map((feed) => {
        if (feed.id !== feedId) {
            return feed;
        }

        return {
            ...feed,
            items: feed.items.map((item) => (item.id !== itemId ? item : { ...item, isRead: true })),
        };
    });

export default feedsSlice;
