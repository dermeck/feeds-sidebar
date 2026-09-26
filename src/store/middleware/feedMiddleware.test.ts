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

const item = (id: string): FeedItem => ({ id, title: id, url: `https://example.com/${id}` });

const loadTwoUnreadItems = (store: ReturnType<typeof setupStore>) =>
    store.dispatch(
        extensionStateLoaded({
            feeds: {
                folders: [],
                feeds: [{ id: 'https://example.com/feed', items: [item('a'), item('b')] }],
                selectedNode: undefined,
            },
            options: { showUnreadBadge: false },
        }),
    );

describe('unread badge', () => {
    it('updates the badge when the options are reset to defaults', async () => {
        const store = setupStore();
        loadTwoUnreadItems(store);
        store.dispatch(optionsSlice.actions.changeShowUnreadBadge(false));
        await flush();

        expect(setBadgeText).toHaveBeenLastCalledWith({ text: '' });

        setBadgeText.mockClear();
        store.dispatch(optionsSlice.actions.resetOptions());
        await flush();

        expect(setBadgeText).toHaveBeenCalledWith({ text: '2' });
    });
});
