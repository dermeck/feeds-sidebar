import React, { Fragment } from 'react';

import { Feed, FeedItem } from '../../../model/feeds';
import { FeedListItem } from './item/FeedListItem';
import { clsx } from 'clsx';

type FeedItemListProps = {
    feed: Feed;
    nestedLevel?: number;
    filterString: string;
    disabled?: boolean;
    getItemLabel?: (item: FeedItem) => string;
};

export const FeedItemList = ({
    feed,
    nestedLevel = 0,
    filterString,
    disabled = false,
    getItemLabel,
}: FeedItemListProps) => {
    if (!feed.items.some((x) => !x.isRead)) {
        return <Fragment />;
    }

    return (
        <ul className={clsx('feed-item-list', disabled && 'feed-item-list--disabled')}>
            {feed.items.map(
                (item) =>
                    item.title?.toLowerCase().includes(filterString.toLowerCase()) && (
                        <FeedListItem
                            key={item.id + item.title}
                            feedId={feed.id}
                            id={item.id}
                            label={getItemLabel ? getItemLabel(item) : item.title}
                            url={item.url}
                            isRead={item.isRead ?? false}
                            title={`${feed.title} | ${item.title} \n${item.url}`}
                            nestedLevel={nestedLevel}
                        />
                    ),
            )}
        </ul>
    );
};
