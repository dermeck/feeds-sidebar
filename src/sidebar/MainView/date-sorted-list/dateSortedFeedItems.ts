import { Feed, itemDate } from '../../../model/feeds';
import { FeedListItemModel } from '../FeedList/item/FeedListItem';

export type DateGroup = { date: string; items: FeedListItemModel[] };

export type DateSortedFeedItems = {
    today: FeedListItemModel[];
    yesterday: FeedListItemModel[];
    days: DateGroup[]; // days of the current month, newest first
    months: DateGroup[]; // previous months, newest first
    unknown: FeedListItemModel[];
};

type DateComparisonResult = 'equal' | 'before' | 'after';

const compareDateDayMonthYear = (date1: Date, date2: Date): DateComparisonResult => {
    if (
        date1.getDate() === date2.getDate() &&
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

const toDayKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const toMonthKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

const toDateGroups = (groups: Map<string, FeedListItemModel[]>) =>
    Array.from(groups.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, items]) => ({ date, items }));

export const getDateSortedFeedItems = (feeds: ReadonlyArray<Feed>) => {
    const today = new Date(Date.now());
    const yesterday = new Date(Date.now());
    yesterday.setDate(today.getDate() - 1);

    const result: DateSortedFeedItems = {
        today: [],
        yesterday: [],
        days: [],
        months: [],
        unknown: [],
    };
    const daysGroups = new Map<string, FeedListItemModel[]>();
    const monthsGroups = new Map<string, FeedListItemModel[]>();
    for (const feed of feeds) {
        for (const feedItem of feed.items) {
            if (!feedItem.isRead) {
                const itemDateValue = itemDate(feedItem);

                if (itemDateValue === undefined) {
                    result.unknown.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                    continue;
                }
                if (compareDateDayMonthYear(today, itemDateValue) === 'equal') {
                    result.today.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                    continue;
                }

                if (compareDateDayMonthYear(yesterday, itemDateValue) === 'equal') {
                    result.yesterday.push({ ...feedItem, parentId: feed.id, parentTitle: feed.title });
                    continue;
                }

                const item = { ...feedItem, parentId: feed.id, parentTitle: feed.title };
                if (
                    itemDateValue.getMonth() === today.getMonth() &&
                    itemDateValue.getFullYear() === today.getFullYear()
                ) {
                    const key = toDayKey(itemDateValue);
                    daysGroups.set(key, [...(daysGroups.get(key) ?? []), item]);
                } else {
                    const key = toMonthKey(itemDateValue);
                    monthsGroups.set(key, [...(monthsGroups.get(key) ?? []), item]);
                }
            }
        }
    }
    result.days = toDateGroups(daysGroups);
    result.months = toDateGroups(monthsGroups);
    return result;
};
