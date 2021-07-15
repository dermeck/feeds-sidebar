import styled from '@emotion/styled';
import React, { Fragment, FunctionComponent } from 'react';
import { Folder } from 'react-feather';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';
import FeedItem from './FeedItem/FeedItem';

const FeedContainer = styled.ul`
    padding-left: 1rem;
    margin: 0.3rem 0 0.7rem 0.5rem;
`;

const FeedTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-left: 0.5rem;
`;

const FeedTitle = styled.label`
    margin-left: 0.25rem;
`;

const FeedList: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds.feeds);

    return (
        <Fragment>
            {feeds.map((feed) => (
                <div key={feed.url}>
                    <FeedTitleContainer>
                        <Folder size={16} />
                        <FeedTitle>{feed.title || feed.url}</FeedTitle>
                    </FeedTitleContainer>

                    <FeedContainer>
                        {feed.items.map(
                            (item) =>
                                !item.isRead && (
                                    <FeedItem
                                        key={item.id}
                                        item={item}
                                        onClick={() =>
                                            dispatch(
                                                feedsSlice.actions.itemRead({
                                                    feedId: feed.id,
                                                    itemId: item.id,
                                                }),
                                            )
                                        }
                                    />
                                ),
                        )}
                    </FeedContainer>
                </div>
            ))}
        </Fragment>
    );
};

export default FeedList;
