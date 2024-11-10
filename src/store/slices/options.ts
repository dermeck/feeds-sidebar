import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { extensionStateLoaded } from '../actions';
import { RootState } from '../store';

export type MainViewDisplayMode = 'folder-tree' | 'plain-list' | 'date-sorted-list';

type OptionsSliceState = {
    feedUpdatePeriodInMinutes: number;
    fetchThreadsCount: number;
    mainViewDisplayMode: MainViewDisplayMode;
    feedDetectionEnabled: boolean;
};

export const initialState: OptionsSliceState = {
    feedUpdatePeriodInMinutes: 30,
    fetchThreadsCount: 4,
    mainViewDisplayMode: 'folder-tree',
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
        mainViewDisplayModeChanged(state, action: PayloadAction<MainViewDisplayMode>) {
            state.mainViewDisplayMode = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(extensionStateLoaded, (state, action) => {
            return { ...action.payload.options };
        });
    },
});

export default optionsSlice;
