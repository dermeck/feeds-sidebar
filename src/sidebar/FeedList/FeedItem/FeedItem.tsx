import styled from '@emotion/styled';
import { GlobeSimple, X } from 'phosphor-react';

import React, { FunctionComponent, memo, useEffect, useState } from 'react';

import { NodeType } from '../../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import feedsSlice from '../../../store/slices/feeds';
import { MouseEventButton } from '../../../utils/types/web-api';
import { Button } from '../../../base-components/Button/Button';

const Container = styled.li<{ focus: boolean; indented: boolean; selected: boolean; nestedLevel: number }>`
    padding-left: ${(props) =>
        !props.indented || props.nestedLevel === 0 ? '20px' : `${25 + props.nestedLevel * 15}px`};

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

// TODO mr remove this next to feed-item__grid
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

const Link = styled.a`
    overflow: hidden;
    padding-top: 4px;
    padding-bottom: 4px;

    color: inherit;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
        text-decoration: underline;
    }
`;

interface Props {
    id: string;
    label: string;
    title: string;
    url: string;
    isRead: boolean;
    feedId: string;
    indented: boolean;
    nestedLevel: number;
}

const FeedItem: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    const isSelected = useAppSelector((state) => state.feeds.selectedNode?.nodeId) === props.id;

    useEffect(() => {
        if (isSelected) {
            setFocus(true);
        }
    }, [isSelected]);

    const [focus, setFocus] = useState<boolean>(false);
    const [xButtonClicked, setXButtonClicked] = useState(false);

    if ((props.isRead && !isSelected) || xButtonClicked) {
        return null;
    }

    const handleFeedItemClick = (feedId: string, itemId: string) => {
        dispatch(feedsSlice.actions.select({ nodeType: NodeType.FeedItem, nodeId: props.id }));

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
            key={props.id}
            indented={props.indented}
            nestedLevel={props.nestedLevel}
            selected={isSelected}
            focus={focus}
            onClick={() => setFocus(true)}
            onBlur={() => {
                setFocus(false);
            }}>
            <GridContainer className="feed-item__grid">
                <GlobeButton>
                    <GlobeSimple size={20} weight="light" />
                </GlobeButton>
                <Link
                    className="feed-item__link"
                    title={props.title}
                    href={props.url}
                    onAuxClick={(e) => {
                        if (e.button === MouseEventButton.middleMousButton) {
                            // mark item as read if middle mouse button is clicked
                            handleFeedItemClick(props.feedId, props.id);
                        }
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => handleFeedItemClick(props.feedId, props.id)}
                    onDragStart={(e) => e.preventDefault()}>
                    {props.label}
                </Link>
                <Button
                    className="feed-item__remove-button"
                    title="Mark as Read"
                    onClick={() => handleXButtonClick(props.feedId, props.id)}>
                    <X size={20} weight="bold" />
                </Button>
            </GridContainer>
        </Container>
    );
};

const MemoizedFeedItem = memo(FeedItem);

if (process.env.MODE === 'dev') {
    MemoizedFeedItem.whyDidYouRender = true;
}

export default MemoizedFeedItem;
