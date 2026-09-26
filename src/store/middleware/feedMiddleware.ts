import { Dispatch, Middleware, UnknownAction } from '@reduxjs/toolkit';

import feedsSlice, { selectTotalUnreadItems, fetchAllFeedsCommand, fetchFeedsCommand } from '../slices/feeds';
import optionsSlice from '../slices/options';
import { RootState } from '../store';

export const updateBadge = (state: RootState) => {
    if (process.env.STAND_ALONE) {
        return;
    }

    const totalUnreadReadItems = state.options.showUnreadBadge ? selectTotalUnreadItems(state.feeds) : 0;

    browser.action.setBadgeText({ text: totalUnreadReadItems !== 0 ? totalUnreadReadItems.toString() : '' });
};

const badgeRelevantActions = [
    feedsSlice.actions.updateFeeds.type,
    feedsSlice.actions.markItemAsRead.type,
    feedsSlice.actions.markSelectedNodeAsRead.type,
    feedsSlice.actions.markAllAsRead.type,
    feedsSlice.actions.deleteSelectedNode.type,
    optionsSlice.actions.changeMaxItemsPerFeed.type,
    optionsSlice.actions.changeShowUnreadBadge.type,
    optionsSlice.actions.resetOptions.type,
];

export const feedMiddleware: Middleware<object, RootState, Dispatch> = (middlewareApi) => (next) => async (action) => {
    if (fetchAllFeedsCommand.match(action)) {
        const feedsTofetch = middlewareApi.getState().feeds.feeds.map((x) => x.id);

        if (feedsTofetch.length > 0) {
            middlewareApi.dispatch(fetchFeedsCommand(feedsTofetch));
        }
    }

    await next(action);

    // reducers must run before this code
    if (feedsSlice.actions.updateFeeds.match(action)) {
        const { maxItemsPerFeed } = middlewareApi.getState().options;

        middlewareApi.dispatch(feedsSlice.actions.trimOverflowingFeedItems(maxItemsPerFeed));
    }

    if (badgeRelevantActions.includes((action as UnknownAction).type)) {
        updateBadge(middlewareApi.getState());
    }
};
