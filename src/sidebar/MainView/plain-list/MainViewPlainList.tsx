import React from 'react';
import clsx from 'clsx';
import { useAppSelector } from '../../../store/hooks';
import { FeedItemList } from '../FeedList/FeedItemList';
import { Feed, FeedItem } from '../../../model/feeds';
import { EmptyListMessage } from '../EmptyListMessage';

interface Props {
    className: string;
    filterString: string;
}

const getItemLabel = (feed: Feed, item: FeedItem) => `${feed.title ? `${feed.title} | ` : ''}${item.title}`;

export const MainViewPlainList = ({ className, filterString }: Props) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);
    const readItemIds = useAppSelector((state) => state.feeds.readItemIds);

    const makeReadKey = (feedId: string, itemId: string) => `${feedId}::${itemId}`;
    const isRead = (feedId: string, itemId: string) =>
        readItemIds.includes(makeReadKey(feedId, itemId)) ||
        readItemIds.includes(itemId) ||
        feeds.some((f) => f.id === feedId && f.items.some((i) => i.id === itemId && i.isRead));

    const hasMatchingItems = feeds.some((feed) =>
        feed.items.some((item) => !isRead(feed.id, item.id) && item.title?.toLowerCase().includes(filterString.toLowerCase())),
    );

    return (
        <div className={clsx('main-view__plain-list', className)}>
            {hasMatchingItems &&
                feeds.map((feed) => {
                    return (
                        <FeedItemList
                            key={feed.id}
                            items={feed.items.map((item) => ({ ...item, parentId: feed.id, parentTitle: feed.title, isRead: isRead(feed.id, item.id) }))}
                            filterString={filterString}
                            getItemLabel={(item) => getItemLabel(feed, item)}
                        />
                    );
                })}
            {!hasMatchingItems && <EmptyListMessage filterString={filterString} />}
        </div>
    );
};
