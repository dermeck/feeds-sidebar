import styled from '@emotion/styled';

import React, { Fragment } from 'react';

import { Feed } from '../../model/feeds';
import FeedItem from './FeedItem';

const FeedContainer = styled.ul<{ disabled: boolean }>`
    padding-left: 0;
    margin: 0;
    opacity: ${(props) => (props.disabled ? 0.3 : 0.9)};
`;

interface FeedItemListProps {
    feed: Feed;
    selectedId?: string;
    indented: boolean;
    nestedLevel: number;
    filterString: string;
    disabled: boolean; // TODO rework Props, disabled, selectedId may not be needed, instead get them inside this component
}

const FeedItemList = (props: FeedItemListProps) => {
    if (!props.feed.items.some((x) => !x.isRead || x.id === props.selectedId)) {
        return <Fragment />;
    }

    return (
        <FeedContainer disabled={props.disabled}>
            {props.feed.items.map(
                (item) =>
                    item.title?.toLowerCase().includes(props.filterString.toLowerCase()) && (
                        <FeedItem
                            key={item.id + item.title}
                            feedId={props.feed.id}
                            id={item.id}
                            label={`${!props.indented && props.feed.title ? `${props.feed.title} | ` : ''}${
                                item.title
                            }`}
                            url={item.url}
                            isRead={item.isRead ?? false}
                            title={`${props.feed.title} | ${item.title} \n${item.url}`}
                            indented={props.indented}
                            nestedLevel={props.nestedLevel}
                        />
                    ),
            )}
        </FeedContainer>
    );
};

export default FeedItemList;
