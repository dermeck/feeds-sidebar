import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

export type FeedSliceState = {
    feeds: ReadonlyArray<Feed>;
    selectedFeedId: Feed['id'];
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
    published?: string;
    lastModified?: string;
    isRead?: boolean;
}

export const fetchAllFeedsCommand = createAction('feeds/fetchAllFeedsCommand');
export const fetchFeedsCommand = createAction<ReadonlyArray<string>>('feeds/fetchFeedsCommand');

const initialState: FeedSliceState = {
    feeds:
        process.env.NODE_ENV === 'development'
            ? [
                  {
                      // sample Atom Feed
                      id: 'https://ourworldindata.org/atom.xml',
                      url: 'https://ourworldindata.org/atom.xml',
                      items: [],
                  },
                  /*
                  {
                      // sample RSS 1.0 / RDF Feed
                      // https://www.w3schools.com/xml/xml_rdf.asp
                      id: 'https://www.dragonball-multiverse.com/flux.rss.php?lang=en',
                      url: 'https://www.dragonball-multiverse.com/flux.rss.php?lang=en',
                      items: [],
                  },

                  {
                      // sample RSS 2.0 Feed
                      id: 'https://www.tagesschau.de/xml/rss2/',
                      url: 'https://www.tagesschau.de/xml/rss2/',
                      items: [],
                  },
                  {
                      // sample Youtube Feed (Atom)
                      id: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA',
                      url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA',
                      items: [],
                  },
                  {
                      id: 'https://stackoverflow.blog/feed/',
                      url: 'https://stackoverflow.blog/feed/',
                      items: [],
                  },
                  {
                      id: 'https://www.quarks.de/feed/',
                      url: 'https://www.quarks.de/feed/',
                      items: [],
                  },
                  */
              ]
            : [],
    selectedFeedId: '',
};

const throwIfNonExistent = (feeds: ReadonlyArray<Feed>, feedId: string) => {
    if (!feeds.some((x) => x.id === feedId)) {
        throw new Error(`feed with id: ${feedId} does not exist`);
    }
};

export const selectTotalUnreadItems = (state: FeedSliceState) =>
    state.feeds
        .map((feed) => feed.items.filter((i) => !i.isRead).length)
        .reduce((totalUnreadReadItems, unReadItemsNexFeed) => totalUnreadReadItems + unReadItemsNexFeed, 0);

export const selectFeeds = (state: RootState) => state.feeds.feeds;

const feedsSlice = createSlice({
    name: 'feeds',
    initialState,
    reducers: {
        extensionStateLoaded(_state, action: PayloadAction<FeedSliceState>) {
            return { ...action.payload };
        },
        selectFeed(state, action: PayloadAction<string>) {
            const feedId = action.payload;

            throwIfNonExistent(state.feeds, feedId);

            state.selectedFeedId = feedId;
        },
        markItemAsRead(state, action: PayloadAction<{ feedId: string; itemId: string }>) {
            return {
                ...state,
                feeds: [...markItemAsRead(state.feeds, action.payload.feedId, action.payload.itemId)],
            };
        },
        markFeedAsRead(state, action: PayloadAction<string>) {
            return {
                ...state,
                feeds: [...markFeedAsRead(state.feeds, action.payload)],
            };
        },
        markSelectedFeedAsRead(state) {
            return {
                ...state,
                feeds: [...markFeedAsRead(state.feeds, state.selectedFeedId)],
            };
        },
        markAllAsRead(state) {
            return {
                ...state,
                feeds: state.feeds.map((feed) => markAllItemsOfFeedRead(feed)),
            };
        },
        updateFeeds(state, action: PayloadAction<ReadonlyArray<Feed>>) {
            return {
                ...state,
                feeds: [...updateFeeds(state.feeds, action.payload)],
            };
        },

        deleteSelectedFeed(state) {
            // index of the feed that gets deleted
            const selectedFeedId = state.selectedFeedId;
            const selectedIndex = state.feeds.findIndex((f) => f.id === selectedFeedId);

            // delete
            state.feeds = state.feeds.filter((f) => f.id !== selectedFeedId);

            // if possible select the the next feed
            state.selectedFeedId =
                state.feeds.length === 0
                    ? ''
                    : state.feeds.length > selectedIndex
                    ? state.feeds[selectedIndex].id
                    : state.feeds[selectedIndex - 1].id;
        },
    },
});

const updateFeeds = (feeds: ReadonlyArray<Feed>, updatedFeeds: ReadonlyArray<Feed>): ReadonlyArray<Feed> => {
    const newFeeds = updatedFeeds.filter((updatedFeed) => !feeds.some((x) => x.url === updatedFeed.url));

    updatedFeeds = feeds.map((feed) => {
        const updatedFeed = updatedFeeds.find((x) => x.url === feed.url);
        if (updatedFeed === undefined) {
            return feed;
        }

        return {
            ...mergeFeed(feed, updatedFeed),
        };
    });

    return updatedFeeds.concat(newFeeds);
};

// keep old items, update existing items, add new items
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
        url: previous.url,
        title: previous.title !== undefined ? previous.title : updatedFeed.title,
        link: updatedFeed.link,
        items: [...previous.items, ...newItems],
    };
};

const markItemAsRead = (feeds: ReadonlyArray<Feed>, feedId: string, itemId: string) =>
    feeds.map((feed) => {
        if (feed.id !== feedId) {
            return feed;
        }

        return {
            ...feed,
            items: feed.items.map((item) => (item.id !== itemId ? item : { ...item, isRead: true })),
        };
    });

const markFeedAsRead = (feeds: ReadonlyArray<Feed>, readFeedId: string): ReadonlyArray<Feed> =>
    feeds.map((feed) => {
        if (feed.id !== readFeedId) {
            return feed;
        }

        return markAllItemsOfFeedRead(feed);
    });

const markAllItemsOfFeedRead = (feed: Feed): Feed => {
    return {
        ...feed,
        items: feed.items.map((item) => ({ ...item, isRead: true })),
    };
};

export default feedsSlice;
