import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import feedsSlice, {
    deleteSelectedFeedCommand,
    selectTotalUnreadItems,
    markSelectedFeedAsReadCommand,
    FeedSliceState,
} from '../slices/feeds';
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
    if (deleteSelectedFeedCommand.match(action)) {
        // TODO command should not be needed, reduce should be able to handle action without payload
        middlewareApi.dispatch(feedsSlice.actions.deleteFeed(middlewareApi.getState().feeds.selectedFeedId));
    }

    if (markSelectedFeedAsReadCommand.match(action)) {
        // TODO command should not be needed, reduce should be able to handle action without payload
        middlewareApi.dispatch(feedsSlice.actions.markFeedAsRead(middlewareApi.getState().feeds.selectedFeedId));
    }

    await next(action);

    // reducers must run before this code
    if (
        feedsSlice.actions.updateFeeds.match(action) ||
        feedsSlice.actions.markItemAsRead.match(action) ||
        feedsSlice.actions.markFeedAsRead.match(action) ||
        feedsSlice.actions.markAllAsRead.match(action) ||
        deleteSelectedFeedCommand.match(action)
    ) {
        updateBadge(middlewareApi.getState().feeds);
    }
};
