import React, { FunctionComponent } from 'react';

import { ScrollContainer } from '../../components/styled';
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
        dispatch(feedsSlice.actions.selectFeed(feedId));
    };

    return (
        <ScrollContainer height={window.innerHeight}>
            {feeds.feeds.map((feed) => (
                <Feed
                    key={feed.id}
                    isSelected={feeds.selectedFeedId === feed.id}
                    feed={feed}
                    onFeedTitleClick={() => handleFeedTitleClick(feed.id)}
                    onItemClick={handleFeedItemClick}
                />
            ))}
        </ScrollContainer>
    );
};

export default FeedList;
