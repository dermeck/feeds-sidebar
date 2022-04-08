import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';

export type OptionsSliceState = {
    feedUpdatePeriodInMinutes: number;
    fetchThreadsCount: number;
    showFeedTitles: boolean;
};

export const initialState: OptionsSliceState = {
    feedUpdatePeriodInMinutes: 30,
    fetchThreadsCount: 4,
    showFeedTitles: true,
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
});

export default optionsSlice;
