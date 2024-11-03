import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { FeedItemList } from '../FeedList/FeedItemList';
import { Feed, FeedItem } from '../../../model/feeds';

interface Props {
    filterString: string;
}

export const MainViewPlainList = ({ filterString }: Props) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);

    const getItemLabel = (feed: Feed, item: FeedItem) => `${feed.title ? `${feed.title} | ` : ''}${item.title}`;

    return (
        <>
            {feeds.map((feed) => {
                return (
                    <FeedItemList
                        key={feed.id}
                        feed={feed}
                        filterString={filterString}
                        getItemLabel={(item) => getItemLabel(feed, item)}
                    />
                );
            })}
        </>
    );
};
