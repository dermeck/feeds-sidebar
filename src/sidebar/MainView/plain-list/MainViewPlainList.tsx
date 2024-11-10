import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { FeedItemList } from '../FeedList/FeedItemList';
import { Feed, FeedItem } from '../../../model/feeds';

interface Props {
    filterString: string;
}

const getItemLabel = (feed: Feed, item: FeedItem) => `${feed.title ? `${feed.title} | ` : ''}${item.title}`;

export const MainViewPlainList = ({ filterString }: Props) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);

    return (
        <>
            {feeds.map((feed) => {
                return (
                    <FeedItemList
                        key={feed.id}
                        items={feed.items.map((item) => ({ ...item, parentId: feed.id, parentTitle: feed.title }))}
                        filterString={filterString}
                        getItemLabel={(item) => getItemLabel(feed, item)}
                    />
                );
            })}
        </>
    );
};
