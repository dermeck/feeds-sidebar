import { AnyAction, Middleware } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { fetchFeedByUrl, fetchAllFeedsCommand } from "../slices/feeds";
import { RootState } from "../store";

export const feedMiddleware: Middleware<
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  RootState,
  ThunkDispatch<RootState, undefined, AnyAction>
> = (storeApi) => (next) => (action) => {
  const result = next(action);

  if (fetchAllFeedsCommand.match(action)) {
    storeApi.getState().feeds.feeds.forEach((feed) => {
      storeApi.dispatch(fetchFeedByUrl(feed.url));
    });
  }
  return result;
};
