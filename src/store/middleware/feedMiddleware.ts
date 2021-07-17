import { AnyAction, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import parseFeed from '../../services/feedParser';
import feedsSlice, { fetchFeedByUrl, fetchAllFeedsCommand } from '../slices/feeds';
import { RootState } from '../store';

export const feedMiddleware: Middleware<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    RootState,
    ThunkDispatch<RootState, undefined, AnyAction>
> = (storeApi) => (next) => async (action) => {
    if (fetchAllFeedsCommand.match(action)) {
        storeApi.getState().feeds.feeds.forEach((feed) => {
            storeApi.dispatch(fetchFeedByUrl(feed.url));
        });
    }

    if (fetchFeedByUrl.fulfilled.match(action)) {
        const parsedFeed = await parseFeed({
            feedUrl: action.meta.arg,
            feedData: action.payload,
        });

        storeApi.dispatch(feedsSlice.actions.updateFeed(parsedFeed));
    }

    return next(action);
};
