import styled from '@emotion/styled';

import React, { FunctionComponent, memo, useEffect, useState } from 'react';
import { Globe, X } from 'react-feather';

import { ToolbarButton } from '../../base-components';
import { FeedItem as FeedItemType } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';

const Container = styled.li<{ focus: boolean; indented: boolean; selected: boolean }>`
    padding-left: ${(props) => (props.indented ? '2.25rem' : '1.5rem')};

    background-color: ${(props) =>
        props.selected
            ? props.focus
                ? props.theme.colors.selectedItemBackgroundColor
                : props.theme.colors.selectedItemNoFocusBackgroundColor
            : 'inherit'};
    color: ${(props) =>
        props.selected
            ? props.focus
                ? props.theme.colors.selectedItemTextColor
                : props.theme.colors.selectedItemNoFocusTextColor
            : 'inherit'};
    list-style: none;
`;

const GridContainer = styled.div`
    display: grid;
    width: 100%;
    align-items: center;
    padding-right: 6px;
    grid-column-gap: 4px;
    grid-template-columns: 16px 1fr 22px;
`;

const GlobeButton = styled.div`
    padding: 2px 0;
    grid: '1';
`;

const Link = styled.a<{ xButtonVisible: boolean }>`
    overflow: hidden;
    width: 100%;
    height: 100%;
    padding-top: 4.5px;

    color: inherit;
    grid-column: ${(props) => (props.xButtonVisible ? 2 : '2 / span 2')};
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
        text-decoration: underline;
    }
`;

const XButton = styled(ToolbarButton)({
    width: '22px',
    height: '22px',
    gridColumn: '3',
    padding: 0,
    ':hover': {
        cursor: 'pointer',
    },
});

interface Props {
    item: FeedItemType;
    feedId: string;
    indented: boolean;
}

const enum AuxButton {
    middleMousButton = 1,
    rightMouseButton = 2,
}

const FeedItem: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    const isSelected = useAppSelector((state) => state.feeds.selectedId) === props.item.id;

    useEffect(() => {
        if (isSelected) {
            setFocus(true);
        }
    }, [isSelected]);

    const [focus, setFocus] = useState<boolean>(false);
    const [showXButton, setShowXButton] = useState(false);
    const [xButtonClicked, setXButtonClicked] = useState(false);

    if ((props.item.isRead && !isSelected) || xButtonClicked) {
        return null;
    }

    const handleFeedItemClick = (feedId: string, itemId: string) => {
        dispatch(feedsSlice.actions.select(props.item.id));

        dispatch(
            feedsSlice.actions.markItemAsRead({
                feedId: feedId,
                itemId: itemId,
            }),
        );
    };

    const handleXButtonClick = (feedId: string, itemId: string) => {
        dispatch(
            feedsSlice.actions.markItemAsRead({
                feedId: feedId,
                itemId: itemId,
            }),
        );

        setXButtonClicked(true);
    };

    return (
        <Container
            key={props.item.id}
            indented={props.indented}
            selected={isSelected}
            focus={focus}
            onClick={() => setFocus(true)}
            onBlur={() => {
                setFocus(false);
            }}
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
                    title={`${props.item.title} \n${props.item.url}`}
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
                    <XButton title="Mark as Read" onClick={() => handleXButtonClick(props.feedId, props.item.id)}>
                        <X size={22} />
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
