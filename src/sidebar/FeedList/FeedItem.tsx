import styled from '@emotion/styled';

import React, { FunctionComponent, memo } from 'react';
import { Globe } from 'react-feather';

import { useAppDispatch } from '../../store/hooks';
import feedsSlice, { FeedItem as FeedItemType } from '../../store/slices/feeds';

const Container = styled.li`
    display: flex;
    flex-direction: row;
    padding: 0.4rem;
    list-style: none;
`;

const Link = styled.a`
    overflow: hidden;
    width: 100%;
    margin-left: 0.25rem;

    color: inherit;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
        text-decoration: underline;
    }
`;

interface Props {
    item: FeedItemType;
    feedId: string;
}

const enum AuxButton {
    middleMousButton = 1,
    rightMouseButton = 2,
}

const FeedItem: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    const handleFeedItemClick = (feedId: string, itemId: string) =>
        dispatch(
            feedsSlice.actions.itemRead({
                feedId: feedId,
                itemId: itemId,
            }),
        );

    return (
        <Container key={props.item.id}>
            <Globe size={16} />
            <Link
                href={props.item.url}
                onAuxClick={(e) => {
                    if (e.button === AuxButton.middleMousButton) {
                        // mark item as read if middle mouse button is clicked
                        handleFeedItemClick(props.feedId, props.item.id);
                    }
                }}
                onContextMenu={
                    // TODO create custom context menu (open in new tab etc)
                    // or find a way to track if item is opened in standard context menu to mark it as read
                    (e) => e.preventDefault()
                }
                onClick={() => handleFeedItemClick(props.feedId, props.item.id)}
                onDragStart={(e) => e.preventDefault()}>
                {props.item.title}
            </Link>
        </Container>
    );
};

const MemoizedFeedItem = memo(FeedItem);

MemoizedFeedItem.whyDidYouRender = true;

export default MemoizedFeedItem;