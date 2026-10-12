import React, { Fragment } from 'react';

import { isHiddenByShortsFilter } from '../../../model/feeds';
import { useAppSelector } from '../../../store/hooks';
import { useItemSelection } from '../selection';
import { FeedListItem, FeedListItemModel } from './item/FeedListItem';
import { clsx } from 'clsx';

type FeedItemListProps = {
    items: FeedListItemModel[];
    nestedLevel?: number;
    filterString: string;
    getItemLabel?: (item: FeedListItemModel) => string;
    disabled?: boolean;
};

export const FeedItemList = ({ items, nestedLevel = 0, filterString, getItemLabel, disabled }: FeedItemListProps) => {
    const { selectedFeedItemId, selectFeedItem } = useItemSelection();
    const hideYoutubeShorts = useAppSelector((state) => state.options.youtubeShortsFilterEnabled);

    const visibleItems = items.filter((item) => !isHiddenByShortsFilter(item, hideYoutubeShorts));

    if (!visibleItems.some((x) => !x.isRead)) {
        return <Fragment />;
    }

    return (
        <ul className={clsx('feed-item-list', disabled && 'feed-item-list--disabled')}>
            {visibleItems.map(
                (item) =>
                    item.title?.toLowerCase().includes(filterString.toLowerCase()) && (
                        <FeedListItem
                            key={item.id + item.title}
                            feedId={item.parentId}
                            id={item.id}
                            label={getItemLabel ? getItemLabel(item) : item.title}
                            url={item.url}
                            isRead={item.isRead ?? false}
                            isSelected={item.id === selectedFeedItemId}
                            onSelect={selectFeedItem}
                            title={`${item.parentTitle} | ${item.title} \n${item.url}`}
                            nestedLevel={nestedLevel}
                            durationSeconds={item.durationSeconds}
                        />
                    ),
            )}
        </ul>
    );
};
