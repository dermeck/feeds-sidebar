import styled from '@emotion/styled';
import React, { Fragment, FunctionComponent } from 'react';
import { Folder } from 'react-feather';

import { Feed as FeedType } from '../../../store/slices/feeds';
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

interface Props {
    feed: FeedType;
    onItemClick: (payload: { feedId: string; itemId: string }) => void;
}

const Feed: FunctionComponent<Props> = (props: Props) => (
    <Fragment>
        <FeedTitleContainer>
            <Folder size={16} />
            <FeedTitle>{props.feed.title || props.feed.url}</FeedTitle>
        </FeedTitleContainer>

        <FeedContainer>
            {props.feed.items.map(
                (item) =>
                    !item.isRead && (
                        <FeedItem
                            key={item.id}
                            item={item}
                            onClick={() =>
                                props.onItemClick({
                                    feedId: props.feed.id,
                                    itemId: item.id,
                                })
                            }
                        />
                    ),
            )}
        </FeedContainer>
    </Fragment>
);

export default Feed;
