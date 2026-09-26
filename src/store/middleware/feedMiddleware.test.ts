import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { FeedItem } from '../../model/feeds';
import { extensionStateLoaded } from '../actions';
import feedsSlice from '../slices/feeds';
import optionsSlice from '../slices/options';
import sessionSlice from '../slices/session';
import { feedMiddleware } from './feedMiddleware';

const setBadgeText = jest.fn();

beforeEach(() => {
    (global as unknown as { browser: unknown }).browser = { action: { setBadgeText } };
});

const setupStore = () =>
    configureStore({
        reducer: combineReducers({
            feeds: feedsSlice.reducer,
            options: optionsSlice.reducer,
            session: sessionSlice.reducer,
        }),
        middleware: (gdm) => gdm().concat(feedMiddleware),
    });

// the middleware is async, so the badge is set after a tick
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

// all items are unread, item "a" is the oldest
const item = (id: string, day: number): FeedItem => ({
    id,
    title: id,
    url: `https://example.com/${id}`,
    published: `2024-01-0${day}T00:00:00Z`,
});

const loadUnreadItems = (store: ReturnType<typeof setupStore>, options: { showUnreadBadge?: boolean } = {}) =>
    store.dispatch(
        extensionStateLoaded({
            feeds: {
                folders: [],
                feeds: [{ id: 'https://example.com/feed', items: [item('a', 1), item('b', 2), item('c', 3)] }],
                selectedNode: undefined,
            },
            options,
        }),
    );

describe('unread badge', () => {
    it('updates the badge when the options are reset to defaults', async () => {
        const store = setupStore();
        loadUnreadItems(store, { showUnreadBadge: false });
        store.dispatch(optionsSlice.actions.changeShowUnreadBadge(false));
        await flush();

        expect(setBadgeText).toHaveBeenLastCalledWith({ text: '' });

        setBadgeText.mockClear();
        store.dispatch(optionsSlice.actions.resetOptions());
        await flush();

        expect(setBadgeText).toHaveBeenCalledWith({ text: '3' });
    });

    it('updates the badge when the item limit is lowered and items are trimmed', async () => {
        const store = setupStore();
        loadUnreadItems(store);
        await flush();
        setBadgeText.mockClear();

        store.dispatch(optionsSlice.actions.changeMaxItemsPerFeed(2));
        await flush();

        // only the two newest of the three unread items are kept
        expect(setBadgeText).toHaveBeenCalledWith({ text: '2' });
    });

    it('updates the badge when a feed with unread items is deleted', async () => {
        const store = setupStore();
        loadUnreadItems(store);
        await flush();
        setBadgeText.mockClear();

        store.dispatch(feedsSlice.actions.deleteFeed({ url: 'https://example.com/feed' }));
        await flush();

        expect(setBadgeText).toHaveBeenCalledWith({ text: '' });
    });
});
