import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import feedsSlice, { selectTotalUnreadItems, FeedSliceState } from '../slices/feeds';
import { RootState } from '../store';

const updateBadge = (feedSliceState: FeedSliceState) => {
    const totalUnreadReadItems = selectTotalUnreadItems(feedSliceState);

    browser.browserAction.setBadgeText({ text: totalUnreadReadItems !== 0 ? totalUnreadReadItems.toString() : '' });
};

export const feedMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    ThunkDispatch<RootState, undefined, AnyAction>
> = (middlewareApi) => (next) => async (action: AnyAction) => {
    await next(action);

    // reducers must run before this code
    if (
        feedsSlice.actions.updateFeeds.match(action) ||
        feedsSlice.actions.markItemAsRead.match(action) ||
        feedsSlice.actions.markFeedAsRead.match(action) ||
        feedsSlice.actions.markAllAsRead.match(action) ||
        feedsSlice.actions.deleteSelectedFeed.match(action)
    ) {
        updateBadge(middlewareApi.getState().feeds);
    }
};
