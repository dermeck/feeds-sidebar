import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import parseFeed from '../../services/feedParser';
import feedsSlice, { fetchFeedByUrl, fetchAllFeedsCommand, addNewFeedByUrl, addNewFeedCommand } from '../slices/feeds';
import { RootState } from '../store';

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

    if (fetchFeedByUrl.fulfilled.match(action)) {
        const parsedFeed = await parseFeed({
            feedUrl: action.meta.arg,
            feedData: action.payload,
        });

        middlewareApi.dispatch(feedsSlice.actions.updateFeed(parsedFeed));
    }

    if (addNewFeedByUrl.fulfilled.match(action)) {
        const parsedFeed = await parseFeed({
            feedUrl: action.meta.arg,
            feedData: action.payload,
        });

        middlewareApi.dispatch(feedsSlice.actions.addFeed(parsedFeed));
    }

    return next(action);
};
