import styled from '@emotion/styled';

import React, { Fragment, FunctionComponent, memo, useState } from 'react';
import { ChevronDown, ChevronRight, Folder } from 'react-feather';

import { colors, rgba } from '../../../base-components/styled/colors';
import { useAppDispatch } from '../../../store/hooks';
import feedsSlice, { Feed as FeedType, FeedItem as FeedItemType } from '../../../store/slices/feeds';
import sessionSlice, { Point } from '../../../store/slices/session';
import FeedItem from './FeedItem/FeedItem';

const FeedContainer = styled.ul`
    padding-left: ${(props: { indented: boolean }) => (props.indented ? '2rem' : '1.5rem')};
    margin: 0 0 0.2rem 0;
`;

interface FeedTitleContainerProps {
    highlight: boolean;
    focus: boolean;
}

const FeedTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.05rem 0 0.2rem 0.5rem;

    background-color: ${(props: FeedTitleContainerProps) =>
        props.highlight
            ? props.focus
                ? rgba(colors.highlightBackgroundColor1, 0.9)
                : colors.highlightBackgroundColorNoFocus
            : 'inherit'};
    color: ${(props: FeedTitleContainerProps) =>
        props.highlight && props.focus ? colors.highlightColor1Light : 'inherit'};
`;

const FeedTitle = styled.label`
    padding-top: 4px;
    margin-left: 0.25rem;
`;

const ToggleIndicator = styled.div`
    margin-right: 0.25rem;
    margin-bottom: -8px;
`;

interface Props {
    feed: FeedType;
    isSelected: boolean;
    showTitle: boolean;
    filterString: string;
}

const renderItem = (
    item: FeedItemType,
    props: Props,
    onItemClick: (payload: { feedId: string; itemId: string }) => void,
) => (
    <FeedItem
        key={item.id + item.title}
        item={item}
        onClick={() =>
            onItemClick({
                feedId: props.feed.id,
                itemId: item.id,
            })
        }
    />
);

const Feed: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    const handleFeedItemClick = (payload: { feedId: string; itemId: string }) =>
        dispatch(
            feedsSlice.actions.itemRead({
                feedId: payload.feedId,
                itemId: payload.itemId,
            }),
        );

    const handleFeedTitleClick = () => {
        dispatch(feedsSlice.actions.selectFeed(props.feed.id));
    };

    const handleOnContextMenu = (anchorPoint: Point) => {
        dispatch(sessionSlice.actions.showContextMenu(anchorPoint));
        dispatch(feedsSlice.actions.selectFeed(props.feed.id));
        // TODO also set Focus (track focused feed in redux)
    };

    const [expanded, setExpanded] = useState<boolean>(false);
    const [focus, setFocus] = useState<boolean>(false);

    return (
        <Fragment>
            {props.showTitle && (
                <FeedTitleContainer
                    tabIndex={0}
                    highlight={props.isSelected}
                    focus={focus}
                    onClick={() => {
                        setExpanded(!expanded);
                        setFocus(true);
                        handleFeedTitleClick();
                    }}
                    onBlur={() => {
                        setFocus(false);
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        handleOnContextMenu({ x: e.clientX, y: e.clientY });
                    }}>
                    <ToggleIndicator>
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </ToggleIndicator>
                    <Folder size={16} />
                    <FeedTitle>{props.feed.title || props.feed.url}</FeedTitle>
                </FeedTitleContainer>
            )}

            {(expanded || !props.showTitle) && (
                <FeedContainer indented={props.showTitle}>
                    {props.feed.items.map(
                        (item) =>
                            !item.isRead &&
                            item.title?.toLowerCase().includes(props.filterString.toLowerCase()) &&
                            renderItem(item, props, handleFeedItemClick),
                    )}
                </FeedContainer>
            )}
        </Fragment>
    );
};

const MemoizedFeed = memo(Feed);

Feed.whyDidYouRender = true;

export default MemoizedFeed;
