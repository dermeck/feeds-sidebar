import deepEqual from 'fast-deep-equal';

import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import parseFeed from '../../services/feedParser';
import feedsSlice, {
    fetchFeedByUrl,
    fetchAllFeedsCommand,
    addNewFeedByUrl,
    addNewFeedCommand,
    importFeedsCommand,
    deleteSelectedFeedCommand,
    selectTotalUnreadItems,
} from '../slices/feeds';
import sessionSlice from '../slices/session';
import { RootState } from '../store';

const updateBadge = (state: RootState) => {
    // TODO dont check all feeds every time (performance)
    const totalUnreadReadItems = selectTotalUnreadItems(state);
    browser.browserAction.setBadgeText({ text: totalUnreadReadItems.toString() });
};

export const feedMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    ThunkDispatch<RootState, undefined, AnyAction>
> = (middlewareApi) => (next) => async (action) => {
    if (fetchAllFeedsCommand.match(action)) {
        middlewareApi.getState().feeds.feeds.forEach((feed) => {
            middlewareApi.dispatch(fetchFeedByUrl(feed.url));
        });
    }

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
        updateBadge(middlewareApi.getState());
    }

    if (fetchFeedByUrl.fulfilled.match(action)) {
        // TODO this results in a lot of state changes - it may be better to fetch all feeds before making state changes
        // this should be possible with sagas https://stackoverflow.com/questions/46569278/how-to-wait-for-all-dynamic-number-of-forks-to-complete-with-redux-saga
        try {
            const parsedFeed = await parseFeed({
                feedUrl: action.meta.arg,
                feedData: action.payload,
            });

            const prevFeed = middlewareApi.getState().feeds.feeds.find((f) => f.url === parsedFeed.url);

            if (!deepEqual(prevFeed, parsedFeed)) {
                middlewareApi.dispatch(feedsSlice.actions.updateFeed(parsedFeed));
                updateBadge(middlewareApi.getState());
            }
        } catch {
            // response is not a feed
            middlewareApi.dispatch(sessionSlice.actions.feedParseError(action.meta.arg));
        }
    }

    if (addNewFeedByUrl.fulfilled.match(action)) {
        try {
            const parsedFeed = await parseFeed({
                feedUrl: action.meta.arg,
                feedData: action.payload,
            });

            middlewareApi.dispatch(feedsSlice.actions.addFeed(parsedFeed));
            updateBadge(middlewareApi.getState());
        } catch {
            // response is not a feed
            middlewareApi.dispatch(sessionSlice.actions.feedParseError(action.meta.arg));
        }
    }

    await next(action);

    // reducers must run before this code
    if (feedsSlice.actions.itemRead.match(action)) {
        updateBadge(middlewareApi.getState());
    }
};
