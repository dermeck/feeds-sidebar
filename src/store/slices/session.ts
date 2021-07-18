import { createSlice } from '@reduxjs/toolkit';

import { addNewFeedByUrl } from './feeds';

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
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addNewFeedByUrl.pending, (state, action) => {
            const entry = state.newFeeds.find((x) => x.url === action.meta.arg);

            if (entry !== undefined) {
                entry.status = 'loading';
            } else {
                state.newFeeds.push({ url: action.meta.arg, status: 'loading' });
            }
        });
        builder.addCase(addNewFeedByUrl.fulfilled, (state, action) => {
            const entry = state.newFeeds.find((x) => x.url === action.meta.arg);

            if (entry !== undefined) {
                entry.status = 'loaded';
            } else {
                state.newFeeds.push({ url: action.meta.arg, status: 'loaded' });
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
