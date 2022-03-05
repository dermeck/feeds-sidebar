import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import parseFeed from '../../services/feedParser';
import feedsSlice, {
    addNewFeedByUrl,
    addNewFeedCommand,
    importFeedsCommand,
    deleteSelectedFeedCommand,
    selectTotalUnreadItems,
    markSelectedFeedAsReadCommand,
    FeedSliceState,
} from '../slices/feeds';
import sessionSlice from '../slices/session';
import { RootState } from '../store';

const updateBadge = (feedSliceState: FeedSliceState) => {
    // TODO dont check all feeds every time (performance)
    const totalUnreadReadItems = selectTotalUnreadItems(feedSliceState);

    browser.browserAction.setBadgeText({ text: totalUnreadReadItems !== 0 ? totalUnreadReadItems.toString() : '' });
};

export const feedMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    ThunkDispatch<RootState, undefined, AnyAction>
> = (middlewareApi) => (next) => async (action: AnyAction) => {
    if (addNewFeedCommand.match(action)) {
        middlewareApi.dispatch(addNewFeedByUrl(action.payload));
    }

    if (importFeedsCommand.match(action)) {
        action.payload.forEach((importedFeed) => {
            if (!middlewareApi.getState().feeds.feeds.some((f) => f.url === importedFeed.url)) {
                middlewareApi.dispatch(addNewFeedByUrl(importedFeed.url));
            }
        });
    }

    if (deleteSelectedFeedCommand.match(action)) {
        middlewareApi.dispatch(feedsSlice.actions.deleteFeed(middlewareApi.getState().feeds.selectedFeedId));
    }

    if (markSelectedFeedAsReadCommand.match(action)) {
        // TODO command should not be needed, reduce should be able to handle action without payload
        middlewareApi.dispatch(feedsSlice.actions.markFeedAsRead(middlewareApi.getState().feeds.selectedFeedId));
    }

    // TODO use saga instead

    if (addNewFeedByUrl.fulfilled.match(action)) {
        try {
            const parsedFeed = await parseFeed({
                feedUrl: action.meta.arg,
                feedData: action.payload,
            });

            if (parsedFeed.type === 'success') {
                middlewareApi.dispatch(feedsSlice.actions.addFeed(parsedFeed.parsedFeed));
            } else if (parsedFeed.type === 'error') {
                // response is not a feed
                middlewareApi.dispatch(sessionSlice.actions.feedParseError(action.meta.arg));
            }
        } catch {
            // response is not a feed
            middlewareApi.dispatch(sessionSlice.actions.feedParseError(action.meta.arg));
        }
    }

    await next(action);

    // reducers must run before this code
    if (
        feedsSlice.actions.addFeed ||
        feedsSlice.actions.updateFeeds ||
        feedsSlice.actions.markItemAsRead.match(action) ||
        feedsSlice.actions.markFeedAsRead.match(action) ||
        feedsSlice.actions.markAllAsRead.match(action) ||
        deleteSelectedFeedCommand.match(action)
    ) {
        updateBadge(middlewareApi.getState().feeds);
    }
};
