import React, { Fragment, FunctionComponent } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';
import Feed from './Feed/Feed';

const FeedList: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds);

    const handleFeedItemClick = (payload: { feedId: string; itemId: string }) =>
        dispatch(
            feedsSlice.actions.itemRead({
                feedId: payload.feedId,
                itemId: payload.itemId,
            }),
        );

    const handleFeedTitleClick = (feedId: string) => {
        console.log('handleFeedTitleClick');
        dispatch(feedsSlice.actions.selectFeed(feedId));
    };

    return (
        <Fragment>
            {feeds.feeds.map((feed) => (
                <Feed
                    key={feed.id}
                    isSelected={feeds.selectedFeedId === feed.id}
                    feed={feed}
                    onFeedTitleClick={() => handleFeedTitleClick(feed.id)}
                    onItemClick={handleFeedItemClick}
                />
            ))}
        </Fragment>
    );
};

export default FeedList;
