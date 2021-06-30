import { AnyAction, Middleware } from "redux";
import { ThunkDispatch } from "redux-thunk";
import parseFeed from "../../services/feedParser";
import feedsSlice, {
  fetchFeedByUrl,
  fetchAllFeedsCommand,
} from "../slices/feeds";
import store, { RootState } from "../store";

export const feedMiddleware: Middleware<
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  RootState,
  ThunkDispatch<RootState, undefined, AnyAction>
> = (storeApi) => (next) => async (action) => {
  const result = next(action);

  if (fetchAllFeedsCommand.match(action)) {
    storeApi.getState().feeds.feeds.forEach((feed) => {
      // TODO url should never be undefined
      if (feed.url !== undefined) storeApi.dispatch(fetchFeedByUrl(feed.url));
    });
  }

  if (fetchFeedByUrl.fulfilled.match(action)) {
    const parsedFeed = await parseFeed(action.payload);

    storeApi.dispatch(feedsSlice.actions.updateFeed(parsedFeed));
  }

  return result;
};
