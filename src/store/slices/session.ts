import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FeedFetchStatus = 'loading' | 'loaded' | 'error';

export const enum MenuType {
    contextMenu,
    moreMenu,
}

export interface Point {
    x: number;
    y: number;
}

export interface MenuContext {
    type: MenuType;
    anchorPoint: Point;
}

export const enum View {
    feedList,
    subscribe,
}

export type SessionSliceState = {
    activeView: View; // TODO use Context API instead of global state
    // feedStatus is managed separately because it can contain entries that have no corresponding feed in feedSlice
    // (recently added and not successfully fetched or parsed)
    feedStatus: ReadonlyArray<{ url: string; status: FeedFetchStatus }>;
    newFeeds: ReadonlyArray<{ url: string; status: FeedFetchStatus }>; // TODO is this needed?!
    menuContext: MenuContext | undefined; // TODO use Context API instead of global state
};

export const initialState: SessionSliceState = {
    activeView: View.feedList,
    newFeeds: [],
    menuContext: undefined,
    feedStatus: [],
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        changeView(state, action: PayloadAction<View>) {
            state.activeView = action.payload;
        },
        feedParseError(state, action: PayloadAction<string>) {
            const entry = state.newFeeds.find((x) => x.url === action.payload);

            if (entry !== undefined) {
                entry.status = 'error';
            } else {
                state.newFeeds.push({ url: action.payload, status: 'error' });
            }
        },
        showContextMenu(state, action: PayloadAction<Point>) {
            state.menuContext = {
                type: MenuType.contextMenu,
                anchorPoint: action.payload,
            };
        },
        showMoreMenu(state, action: PayloadAction<Point>) {
            state.menuContext = {
                type: MenuType.moreMenu,
                anchorPoint: action.payload,
            };
        },
        hideMenu(state) {
            state.menuContext = undefined;
        },
        changeFeedsStatus(
            state,
            action: PayloadAction<{ newStatus: FeedFetchStatus; feedUrls: ReadonlyArray<string> }>,
        ) {
            const { feedUrls, newStatus } = action.payload;

            const updated = state.feedStatus.map((f) =>
                feedUrls.some((url) => url === f.url)
                    ? {
                          ...f,
                          status: newStatus,
                      }
                    : f,
            );

            const newEntries = feedUrls
                .map((url) =>
                    state.feedStatus.find((entry) => entry.url === url)
                        ? undefined
                        : {
                              url: url,
                              status: newStatus,
                          },
                )
                .filter((i) => i !== undefined) as ReadonlyArray<{ url: string; status: FeedFetchStatus }>;

            state.feedStatus = [...updated, ...newEntries];
        },
    },
});

export default sessionSlice;
