import React, { useMemo } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { FeedItemList } from '../FeedList/FeedItemList';
import { Feed, FeedItem } from '../../../model/feeds';

// TODO mr group by parent instead of repetition
type DateSortedFeedItems = {
    today: (FeedItem & { parentId: string; parentTitle?: string })[];
    yesterday: (FeedItem & { parentId: string; parentTitle?: string })[];
    lastWeek: (FeedItem & { parentId: string; parentTitle?: string })[];
    older: (FeedItem & { parentId: string; parentTitle?: string })[];
    unknown: (FeedItem & { parentId: string; parentTitle?: string })[];
};

interface MainViewPlainListProps {
    filterString: string;
}

const getItemLabel = (feed: Feed, item: FeedItem) => `${feed.title ? `${feed.title} | ` : ''}${item.title}`;

type DateComparisonResult = 'equal' | 'before' | 'after';

const compareDateDayMonthYear = (date1: Date, date2: Date): DateComparisonResult => {
    if (
        date1.getDay() === date2.getDay() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    ) {
        return 'equal';
    }

    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);

    if (date1 <= date2) {
        return 'before';
    }

    // console.log('after');
    return 'after';
};

export const MainViewDateSortedList = ({ filterString }: MainViewPlainListProps) => {
    const feeds = useAppSelector((state) => state.feeds.feeds);
    console.log('feeds', feeds);

    const sortedFeeds: DateSortedFeedItems = useMemo(() => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        const result: DateSortedFeedItems = {
            today: [],
            yesterday: [],
            lastWeek: [],
            older: [],
            unknown: [],
        };
        for (const feed of feeds) {
            for (const feedItem of feed.items) {
                if (!feedItem.isRead) {
                    const itemDateString = feedItem.lastModified ?? feedItem.published;
                    if (!itemDateString) {
                        result.unknown.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                    } else {
                        const itemDate = new Date(itemDateString);
                        if (compareDateDayMonthYear(today, itemDate) === 'equal') {
                            result.today.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                        }

                        if (compareDateDayMonthYear(yesterday, itemDate) === 'equal') {
                            result.yesterday.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                        }

                        if (compareDateDayMonthYear(lastWeek, itemDate) === 'before') {
                            result.lastWeek.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                        } else {
                            result.older.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                        }
                    }
                }
            }
        }
        console.log(result);
        return result;
    }, [feeds]);

    // TODO mr refactor FeedItemList
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
