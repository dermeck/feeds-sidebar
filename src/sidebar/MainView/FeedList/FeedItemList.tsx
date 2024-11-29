import React, { Fragment, useContext } from 'react';

import { FeedListItem, FeedListItemModel } from './item/FeedListItem';
import { clsx } from 'clsx';
import { DragDropContext } from '../folder-tree/dragdrop/dragdrop-context';

type FeedItemListProps = {
    items: FeedListItemModel[];
    nestedLevel?: number;
    filterString: string;
    getItemLabel?: (item: FeedListItemModel) => string;
};

export const FeedItemList = ({ items, nestedLevel = 0, filterString, getItemLabel }: FeedItemListProps) => {
    const { draggedNode } = useContext(DragDropContext);

    if (!items.some((x) => !x.isRead)) {
        return <Fragment />;
    }

    return (
        <ul className={clsx('feed-item-list', draggedNode !== undefined && 'feed-item-list--disabled')}>
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
