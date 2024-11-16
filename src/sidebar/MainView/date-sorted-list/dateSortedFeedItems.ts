import { Feed } from '../../../model/feeds';
import { FeedListItemModel } from '../FeedList/item/FeedListItem';

export type DateSortedFeedItems = {
    today: FeedListItemModel[];
    yesterday: FeedListItemModel[];
    lastWeek: FeedListItemModel[];
    older: FeedListItemModel[];
    unknown: FeedListItemModel[];
};

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

    return 'after';
};

export const getDateSortedFeedItems = (feeds: ReadonlyArray<Feed>) => {
    const today = new Date(Date.now());
    const yesterday = new Date(Date.now());
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
                const itemDate = itemDateString ? new Date(itemDateString) : undefined;

                if (itemDate === undefined || itemDate.toString() === 'Invalid Date') {
                    result.unknown.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                    continue;
                }
                if (compareDateDayMonthYear(today, itemDate) === 'equal') {
                    result.today.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                    continue;
                }

                if (compareDateDayMonthYear(yesterday, itemDate) === 'equal') {
                    result.yesterday.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                    continue;
                }

                if (compareDateDayMonthYear(lastWeek, itemDate) === 'before') {
                    result.lastWeek.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                } else {
                    result.older.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                }
            }
        }
    }
    return result;
};
