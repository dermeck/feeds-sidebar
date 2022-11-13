import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import feedsSlice, { selectTotalUnreadItems, fetchAllFeedsCommand, fetchFeedsCommand } from '../slices/feeds';
import { RootState } from '../store';

const updateBadge = (feedSliceState: RootState['feeds']) => {
    const totalUnreadReadItems = selectTotalUnreadItems(feedSliceState);

    browser.browserAction.setBadgeText({ text: totalUnreadReadItems !== 0 ? totalUnreadReadItems.toString() : '' });
};

export const feedMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    ThunkDispatch<RootState, undefined, AnyAction>
> = (middlewareApi) => (next) => async (action: AnyAction) => {
    if (fetchAllFeedsCommand.match(action)) {
        const feedsTofetch = middlewareApi.getState().feeds.feeds.map((x) => x.id);

        if (feedsTofetch.length > 0) {
            middlewareApi.dispatch(fetchFeedsCommand(feedsTofetch));
        }
    }

    await next(action);

    // reducers must run before this code
    if (
        feedsSlice.actions.updateFeeds.match(action) ||
        feedsSlice.actions.markItemAsRead.match(action) ||
        feedsSlice.actions.markSelectedNodeAsRead.match(action) ||
        feedsSlice.actions.markAllAsRead.match(action) ||
        feedsSlice.actions.deleteSelectedNode.match(action)
    ) {
        updateBadge(middlewareApi.getState().feeds);
    }
};
