import styled from '@emotion/styled';

import React, { FunctionComponent, memo, useState } from 'react';
import { Globe, X } from 'react-feather';

import { ToolbarButton } from '../../base-components';
import { useAppDispatch } from '../../store/hooks';
import feedsSlice, { FeedItem as FeedItemType } from '../../store/slices/feeds';

const Container = styled.li`
    list-style: none;
`;

const GridContainer = styled.div`
    display: grid;
    align-items: center;
    grid-column-gap: 4px;
    grid-template-columns: 16px 1fr 16px;
    width: 100%;
    padding-right: 0.4rem;
`;

const GlobeButton = styled.div`
    padding: 0.25rem 0;
    grid: '1';
`;

const Link = styled.a<{ xButtonVisible: boolean }>`
    grid-column: ${(props) => (props.xButtonVisible ? 2 : '2 / span 2')};
    overflow: hidden;
    width: 100%;

    color: inherit;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
        text-decoration: underline;
    }
`;

const XButton = styled(ToolbarButton)({
    width: '18px',
    height: '18px',
    gridColumn: '3',
    padding: 0,

    ':hover': {
        cursor: 'pointer',
    },
});

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

    const [showXButton, setShowXButton] = useState(false);

    const handleFeedItemClick = (feedId: string, itemId: string) =>
        dispatch(
            feedsSlice.actions.markItemAsRead({
                feedId: feedId,
                itemId: itemId,
            }),
        );

    return (
        <Container
            key={props.item.id}
            onMouseEnter={() => {
                if (!showXButton) {
                    setShowXButton(true);
                }
            }}
            onMouseLeave={() => {
                setShowXButton(false);
            }}>
            <GridContainer>
                <GlobeButton>
                    <Globe size={16} />
                </GlobeButton>
                <Link
                    xButtonVisible={showXButton}
                    href={props.item.url}
                    onAuxClick={(e) => {
                        if (e.button === AuxButton.middleMousButton) {
                            // mark item as read if middle mouse button is clicked
                            handleFeedItemClick(props.feedId, props.item.id);
                        }
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => handleFeedItemClick(props.feedId, props.item.id)}
                    onDragStart={(e) => e.preventDefault()}>
                    {props.item.title}
                </Link>
                {showXButton && (
                    <XButton onClick={() => handleFeedItemClick(props.feedId, props.item.id)}>
                        <X size={18} />
                    </XButton>
                )}
            </GridContainer>
        </Container>
    );
};

const MemoizedFeedItem = memo(FeedItem);

if (process.env.MODE === 'dev') {
    MemoizedFeedItem.whyDidYouRender = true;
}

export default MemoizedFeedItem;
