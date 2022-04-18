import styled from '@emotion/styled';
import { GlobeSimple, X } from 'phosphor-react';

import React, { FunctionComponent, memo, useEffect, useState } from 'react';

import { ToolbarButton } from '../../base-components';
import { FeedItem as FeedItemType } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';

const Container = styled.li<{ focus: boolean; indented: boolean; selected: boolean }>`
    padding-left: ${(props) => (props.indented ? '39px' : '20px')};

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
    grid-template-columns: 18px 1fr 22px;
`;

const GlobeButton = styled.div`
    display: inherit;
    grid: '1';
`;

const Link = styled.a<{ xButtonVisible: boolean }>`
    overflow: hidden;
    padding-top: 4px;
    padding-bottom: 4px;

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
    padding: '1px',
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

    const isSelected = useAppSelector((state) => state.feeds.selectedNodeId) === props.item.id;

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
                    <GlobeSimple size={20} weight="light" />
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
                        <X size={20} weight="bold" />
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
