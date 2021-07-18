import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import feedsSlice, { addNewFeedByUrl } from './feeds';

type FeedFetchStatus = 'loading' | 'loaded' | 'error';

export type SessionSliceState = {
    newFeeds: ReadonlyArray<{ url: string; status?: FeedFetchStatus }>;
};

export const initialState: SessionSliceState = {
    newFeeds: [],
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        feedParseError(state, action: PayloadAction<string>) {
            const entry = state.newFeeds.find((x) => x.url === action.payload);

            if (entry !== undefined) {
                entry.status = 'error';
            } else {
                state.newFeeds.push({ url: action.payload, status: 'error' });
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addNewFeedByUrl.pending, (state, action) => {
            const entry = state.newFeeds.find((x) => x.url === action.meta.arg);

            if (entry !== undefined) {
                entry.status = 'loading';
            } else {
                state.newFeeds.push({ url: action.meta.arg, status: 'loading' });
            }
        });
        builder.addCase(feedsSlice.actions.addFeed, (state, action) => {
            // don't act on .fulfilled because the parser could have thrown an error
            const entry = state.newFeeds.find((x) => x.url === action.payload.url);

            if (entry !== undefined) {
                entry.status = 'loaded';
            } else {
                state.newFeeds.push({ url: action.payload.url, status: 'loaded' });
            }
        });
        builder.addCase(addNewFeedByUrl.rejected, (state, action) => {
            const entry = state.newFeeds.find((x) => x.url === action.meta.arg);

            if (entry !== undefined) {
                entry.status = 'error';
            } else {
                state.newFeeds.push({ url: action.meta.arg, status: 'error' });
            }
        });
    },
});

export default sessionSlice;
