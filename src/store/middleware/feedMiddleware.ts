import { Dispatch, Middleware, UnknownAction } from '@reduxjs/toolkit';

import feedsSlice, { selectTotalUnreadItems, fetchAllFeedsCommand, fetchFeedsCommand } from '../slices/feeds';
import optionsSlice from '../slices/options';
import { RootState } from '../store';

export const updateBadge = (state: RootState) => {
    if (process.env.STAND_ALONE) {
        return;
    }

    const totalUnreadReadItems = state.options.showUnreadBadge
        ? selectTotalUnreadItems(state.feeds, state.options.youtubeShortsFilterEnabled)
        : 0;

    browser.action.setBadgeText({ text: totalUnreadReadItems !== 0 ? totalUnreadReadItems.toString() : '' });
};

const badgeRelevantActions = [
    feedsSlice.actions.updateFeeds.type,
    feedsSlice.actions.markItemAsRead.type,
    feedsSlice.actions.markNodeAsRead.type,
    feedsSlice.actions.markAllAsRead.type,
    feedsSlice.actions.deleteNode.type,
    feedsSlice.actions.deleteFeed.type,
    feedsSlice.actions.setItemsShortStatus.type,
    optionsSlice.actions.changeMaxItemsPerFeed.type,
    optionsSlice.actions.changeShowUnreadBadge.type,
    optionsSlice.actions.changeYoutubeShortsFilterEnabled.type,
    optionsSlice.actions.resetOptions.type,
];

export const feedMiddleware: Middleware<object, RootState, Dispatch> = (middlewareApi) => (next) => (action) => {
    if (fetchAllFeedsCommand.match(action)) {
        const feedsTofetch = middlewareApi.getState().feeds.feeds.map((x) => x.id);

        if (feedsTofetch.length > 0) {
            middlewareApi.dispatch(fetchFeedsCommand(feedsTofetch));
        }
    }

    const result = next(action);

    if (badgeRelevantActions.includes((action as UnknownAction).type)) {
        updateBadge(middlewareApi.getState());
    }

    return result;
};
