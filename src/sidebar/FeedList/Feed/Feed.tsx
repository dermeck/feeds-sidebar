import styled from '@emotion/styled';
import React, { Fragment, FunctionComponent, useState } from 'react';
import { ChevronDown, ChevronRight, Folder } from 'react-feather';

import { colors, rgba } from '../../../components/styled/colors';
import { Feed as FeedType, FeedItem as FeedItemType } from '../../../store/slices/feeds';
import FeedItem from './FeedItem/FeedItem';

const FeedContainer = styled.ul`
    padding-left: 2rem;
    margin: 0 0 0.2rem 0;
`;

const FeedTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    background-color: ${(props: { highlight: boolean }) =>
        props.highlight ? rgba(colors.highlightBackgroundColor1, 0.9) : 'inherit'};
    color: ${(props: { highlight: boolean }) => (props.highlight ? colors.highlightColor1 : 'inherit')};

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

    return (
        <Fragment>
            <FeedTitleContainer
                highlight={props.isSelected}
                onClick={() => {
                    setExpanded(!expanded);
                    props.onFeedTitleClick();
                }}>
                <ToggleIndicator>{expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</ToggleIndicator>
                <Folder size={16} />
                <FeedTitle>{props.feed.title || props.feed.url}</FeedTitle>
            </FeedTitleContainer>

            {expanded && (
                <FeedContainer>{props.feed.items.map((item) => !item.isRead && renderItem(item, props))}</FeedContainer>
            )}
        </Fragment>
    );
};

export default Feed;
