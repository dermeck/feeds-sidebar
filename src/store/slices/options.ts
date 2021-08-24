import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OptionsSliceState = {
    feedUpdatePeriodInMinutes: number;
};

export const initialState: OptionsSliceState = {
    feedUpdatePeriodInMinutes: 30,
};

const optionsSlice = createSlice({
    name: 'options',
    initialState,
    reducers: {
        changeFeedUpdatePeriodInMinutes(state, action: PayloadAction<number>) {
            state.feedUpdatePeriodInMinutes = action.payload;
        },
    },
});

export default optionsSlice;
