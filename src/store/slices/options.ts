import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { extensionStateLoaded } from '../actions';
import { RootState } from '../store';

export type MainViewDisplayMode = 'folder-tree' | 'plain-list' | 'date-sorted-list';

export type SidebarSurface = 'auto' | 'builtin-theme' | 'system-theme' | 'custom';

// 'flat' is Firefox's current (Nova) history look, 'raised' the pre-Nova moz-card box
export type DateGroupCardStyle = 'flat' | 'raised';

export const FEED_UPDATE_MINUTES_MIN = 5;
export const FEED_UPDATE_MINUTES_MAX = 1440;
export const FETCH_THREADS_MIN = 1;
export const FETCH_THREADS_MAX = 8;
export const DIAGNOSIS_DAYS_MIN = 7;
export const DIAGNOSIS_DAYS_MAX = 365;
export const MAX_ITEMS_PER_FEED_DEFAULT = 200;

type OptionsSliceState = {
    feedUpdatePeriodInMinutes: number;
    fetchThreadsCount: number;
    mainViewDisplayMode: MainViewDisplayMode;
    feedDetectionEnabled: boolean;
    diagnosisInactiveDays: number;
    showUnreadBadge: boolean;
    maxItemsPerFeed: number;
    sidebarSurface: SidebarSurface;
    sidebarCustomColorLight: string;
    sidebarCustomColorDark: string;
    dateGroupCardStyle: DateGroupCardStyle;
};

export const initialState: OptionsSliceState = {
    feedUpdatePeriodInMinutes: 30,
    fetchThreadsCount: 4,
    mainViewDisplayMode: 'folder-tree',
    feedDetectionEnabled: true,
    diagnosisInactiveDays: 60,
    showUnreadBadge: true,
    maxItemsPerFeed: MAX_ITEMS_PER_FEED_DEFAULT,
    sidebarSurface: 'auto',
    sidebarCustomColorLight: '#ffffff',
    sidebarCustomColorDark: '#2b2a33',
    dateGroupCardStyle: 'flat',
};

export const selectOptions = (state: RootState) => state.options;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// input[type=color] only ever yields #rrggbb, but persisted options are not guaranteed to come from it
const normalizeColor = (value: string) => {
    const trimmed = value.trim().toLowerCase();

    return /^#[\da-f]{6}$/.test(trimmed) ? trimmed : undefined;
};

const optionsSlice = createSlice({
    name: 'options',
    initialState,
    reducers: {
        changeFeedUpdatePeriodInMinutes(state, action: PayloadAction<number>) {
            state.feedUpdatePeriodInMinutes = clamp(action.payload, FEED_UPDATE_MINUTES_MIN, FEED_UPDATE_MINUTES_MAX);
        },
        changeFetchThreadsCount(state, action: PayloadAction<number>) {
            state.fetchThreadsCount = clamp(action.payload, FETCH_THREADS_MIN, FETCH_THREADS_MAX);
        },
        mainViewDisplayModeChanged(state, action: PayloadAction<MainViewDisplayMode>) {
            state.mainViewDisplayMode = action.payload;
        },
        changeDiagnosisInactiveDays(state, action: PayloadAction<number>) {
            state.diagnosisInactiveDays = clamp(action.payload, DIAGNOSIS_DAYS_MIN, DIAGNOSIS_DAYS_MAX);
        },
        changeFeedDetectionEnabled(state, action: PayloadAction<boolean>) {
            state.feedDetectionEnabled = action.payload;
        },
        changeShowUnreadBadge(state, action: PayloadAction<boolean>) {
            state.showUnreadBadge = action.payload;
        },
        changeMaxItemsPerFeed(state, action: PayloadAction<number>) {
            state.maxItemsPerFeed = Math.max(0, Math.round(action.payload));
        },
        sidebarSurfaceChanged(state, action: PayloadAction<SidebarSurface>) {
            state.sidebarSurface = action.payload;
        },
        sidebarCustomColorLightChanged(state, action: PayloadAction<string>) {
            const color = normalizeColor(action.payload);

            if (color !== undefined) {
                state.sidebarCustomColorLight = color;
            }
        },
        sidebarCustomColorDarkChanged(state, action: PayloadAction<string>) {
            const color = normalizeColor(action.payload);

            if (color !== undefined) {
                state.sidebarCustomColorDark = color;
            }
        },
        dateGroupCardStyleChanged(state, action: PayloadAction<DateGroupCardStyle>) {
            state.dateGroupCardStyle = action.payload;
        },
        resetOptions() {
            return { ...initialState };
        },
    },

    extraReducers: (builder) => {
        builder.addCase(extensionStateLoaded, (state, action) => {
            // merge with defaults so state saved by older versions without newer fields still loads correctly
            return { ...initialState, ...action.payload.options };
        });
    },
});

export default optionsSlice;
