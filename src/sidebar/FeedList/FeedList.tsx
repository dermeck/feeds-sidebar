import React, { Fragment, FunctionComponent } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';
import Feed from './Feed/Feed';

const FeedList: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds.feeds);

    const handleFeedItemClicked = (payload: { feedId: string; itemId: string }) => {
        dispatch(
            feedsSlice.actions.itemRead({
                feedId: payload.feedId,
                itemId: payload.itemId,
            }),
        );
    };

    return (
        <Fragment>
            {feeds.map((feed) => (
                <Feed key={feed.id} feed={feed} onItemClick={handleFeedItemClicked} />
            ))}
        </Fragment>
    );
};

export default FeedList;
