import React, { Fragment } from 'react';

import { FeedItem } from '../../../model/feeds';
import { FeedListItem } from './item/FeedListItem';
import { clsx } from 'clsx';

type FeedItemListProps = {
    items: (FeedItem & { parentId: string; parentTitle?: string })[];
    nestedLevel?: number;
    filterString: string;
    disabled?: boolean;
    getItemLabel?: (item: FeedItem) => string;
};

export const FeedItemList = ({
    items,
    nestedLevel = 0,
    filterString,
    disabled = false,
    getItemLabel,
}: FeedItemListProps) => {
    if (!items.some((x) => !x.isRead)) {
        return <Fragment />;
    }

    return (
        <ul className={clsx('feed-item-list', disabled && 'feed-item-list--disabled')}>
            {items.map(
                (item) =>
                    item.title?.toLowerCase().includes(filterString.toLowerCase()) && (
                        <FeedListItem
                            key={item.id + item.title}
                            feedId={item.parentId}
                            id={item.id}
                            label={getItemLabel ? getItemLabel(item) : item.title}
                            url={item.url}
                            isRead={item.isRead ?? false}
                            title={`${item.parentTitle} | ${item.title} \n${item.url}`}
                            nestedLevel={nestedLevel}
                        />
                    ),
            )}
        </ul>
    );
};