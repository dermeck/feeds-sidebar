import styled from '@emotion/styled';
import React, { Fragment, FunctionComponent, useState } from 'react';
import { ChevronDown, ChevronRight, Folder } from 'react-feather';

import { colors, rgba } from '../../../components/styled/colors';
import { Feed as FeedType, FeedItem as FeedItemType } from '../../../store/slices/feeds';
import { Point } from '../../../store/slices/session';
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

    background-color: ${(props: FeedTitleContainerProps) =>
        props.highlight
            ? props.focus
                ? rgba(colors.highlightBackgroundColor1, 0.9)
                : colors.highlightBackgroundColorNoFocus
            : 'inherit'};
    color: ${(props: FeedTitleContainerProps) =>
        props.highlight && props.focus ? colors.highlightColor1Light : 'inherit'};

    padding: 0.05rem 0 0.2rem 0.5rem;
`;

const FeedTitle = styled.label`
    margin-left: 0.25rem;
    padding-top: 4px;
`;

const ToggleIndicator = styled.div`
    margin-right: 0.25rem;
    margin-bottom: -8px;
`;

interface Props {
    feed: FeedType;
    isSelected: boolean;
    onFeedTitleClick: () => void;
    onItemClick: (payload: { feedId: string; itemId: string }) => void;
    onContextMenu: (anchorPoint: Point) => void;
    showTitle: boolean;
    filterString: string;
}

const renderItem = (item: FeedItemType, props: Props) => (
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
);

const Feed: FunctionComponent<Props> = (props: Props) => {
    const [expanded, setExpanded] = useState<boolean>(true);
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
                        props.onFeedTitleClick();
                    }}
                    onBlur={() => {
                        setFocus(false);
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        props.onContextMenu({ x: e.clientX, y: e.clientY });
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
                            item.title.toLowerCase().includes(props.filterString.toLowerCase()) &&
                            renderItem(item, props),
                    )}
                </FeedContainer>
            )}
        </Fragment>
    );
};

export default Feed;
