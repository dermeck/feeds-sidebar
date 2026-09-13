import React from 'react';
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

    const hasMatchingItems = feeds.some((feed) =>
        feed.items.some(
            (item) => !item.isRead && item.title?.toLowerCase().includes(filterString.toLowerCase()),
        ),
    );

    return (
        <div className={className}>
            {hasMatchingItems &&
                feeds.map((feed) => {
                    return (
                        <FeedItemList
                            key={feed.id}
                            items={feed.items.map((item) => ({ ...item, parentId: feed.id, parentTitle: feed.title }))}
                            filterString={filterString}
                            getItemLabel={(item) => getItemLabel(feed, item)}
                        />
                    );
                })}
            {!hasMatchingItems && <EmptyListMessage filterString={filterString} />}
        </div>
    );
};
