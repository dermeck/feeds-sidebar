import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { extensionStateLoaded } from '../actions';
import { RootState } from '../store';

type OptionsSliceState = {
    feedUpdatePeriodInMinutes: number;
    fetchThreadsCount: number;
    showFeedTitles: boolean;
    feedDetectionEnabled: boolean;
};

export const initialState: OptionsSliceState = {
    feedUpdatePeriodInMinutes: 30,
    fetchThreadsCount: 4,
    showFeedTitles: true,
    feedDetectionEnabled: true,
};

export const selectOptions = (state: RootState) => state.options;

const optionsSlice = createSlice({
    name: 'options',
    initialState,
    reducers: {
        changeFeedUpdatePeriodInMinutes(state, action: PayloadAction<number>) {
            state.feedUpdatePeriodInMinutes = action.payload;
        },
        toggleShowFeedTitles(state) {
            state.showFeedTitles = !state.showFeedTitles;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(extensionStateLoaded, (state, action) => {
            return { ...action.payload.options };
        });
    },
});

export default optionsSlice;
