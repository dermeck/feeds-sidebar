import { FeedItem } from '../../../model/feeds';
import { getDateSortedFeedItems } from './dateSortedFeedItems';

const itemFixture: ({
    id,
    lastModified,
    published,
}: {
    id: string;
    lastModified?: string;
    published?: string;
}) => FeedItem = ({ id, lastModified, published }: { id: string; lastModified?: string; published?: string }) => ({
    id: id,
    url: `http://feed.url/${id}`,
    title: `title-${id}`,
    isRead: false,
    lastModified: lastModified,
    published: published,
});

describe('#getDateSortedFeedItems', () => {
    it('assigns items from today to "today"', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [itemFixture({ id: 'todayFeedId', published: 'Fri Nov 15 2024' })],
            },
        ]);

        expect(result.today[0].id).toBe('todayFeedId');
    });

    it('assigns items from yesterday to "yesterday"', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [itemFixture({ id: 'yesterdayFeedId', published: 'Thu Nov 14 2024' })],
            },
        ]);

        expect(result.yesterday[0].id).toBe('yesterdayFeedId');
    });

    it('assigns items of the current month that are neither today nor yesterday to "days"', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [itemFixture({ id: 'dayFeedId', published: 'Wed Nov 13 2024' })],
            },
        ]);

        expect(result.days[0].date).toBe('2024-11-13');
        expect(result.days[0].items[0].id).toBe('dayFeedId');
    });

    it('groups "days" by day within the current month, newest first', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [
                    itemFixture({ id: 'thirteenthFeedId', published: 'Wed Nov 13 2024' }),
                    itemFixture({ id: 'ninthFeedId', published: 'Sat Nov 9 2024' }),
                ],
            },
            {
                id: 'feedId2',
                items: [itemFixture({ id: 'thirteenthFeedId2', published: 'Wed Nov 13 2024' })],
            },
        ]);

        expect(result.days).toHaveLength(2);
        expect(result.days[0].date).toBe('2024-11-13');
        expect(result.days[0].items.map((x) => x.id)).toEqual(['thirteenthFeedId', 'thirteenthFeedId2']);
        expect(result.days[1].date).toBe('2024-11-09');
        expect(result.days[1].items[0].id).toBe('ninthFeedId');
    });

    it('does not treat the same weekday earlier in the month as today', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [itemFixture({ id: 'fridayFeedId', published: 'Fri Nov 1 2024' })],
            },
        ]);

        expect(result.today).toHaveLength(0);
        expect(result.days[0].date).toBe('2024-11-01');
    });

    it('assigns items from previous months to "months", grouped by month', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [itemFixture({ id: 'octoberFeedId', published: 'Wed Oct 9 2024' })],
            },
        ]);

        expect(result.months[0].date).toBe('2024-10');
        expect(result.months[0].items[0].id).toBe('octoberFeedId');
    });

    it('groups "months" newest first', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [
                    itemFixture({ id: 'octoberFeedId', published: 'Wed Oct 9 2024' }),
                    itemFixture({ id: 'septemberFeedId', published: 'Mon Sep 9 2024' }),
                    itemFixture({ id: 'octoberFeedId2', published: 'Tue Oct 1 2024' }),
                ],
            },
        ]);

        expect(result.months).toHaveLength(2);
        expect(result.months[0].date).toBe('2024-10');
        expect(result.months[0].items.map((x) => x.id)).toEqual(['octoberFeedId', 'octoberFeedId2']);
        expect(result.months[1].date).toBe('2024-09');
        expect(result.months[1].items[0].id).toBe('septemberFeedId');
    });

    it('assigns items with unknown date to "unknown"', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [itemFixture({ id: 'unknownFeedId1', published: 'moep' })],
            },
            {
                id: 'feedId',
                items: [itemFixture({ id: 'unknownFeedId2', published: undefined })],
            },
        ]);

        expect(result.unknown[0].id).toBe('unknownFeedId1');
        expect(result.unknown[1].id).toBe('unknownFeedId2');
    });

    it('prioritizes date of last modification', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [
                    itemFixture({
                        id: 'publishedLastWeekModifiedTodayId',
                        published: 'Wed Nov 13 2024',
                        lastModified: 'Fri Nov 15 2024',
                    }),
                ],
            },
        ]);

        expect(result.today[0].id).toBe('publishedLastWeekModifiedTodayId');
    });

    it('sorts multiple items into the correct buckets', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [itemFixture({ id: 'todayFeedId', published: 'Fri Nov 15 2024' })],
            },

            {
                id: 'feedId',
                items: [itemFixture({ id: 'unknownFeedId', published: undefined })],
            },
            {
                id: 'feedId',
                items: [itemFixture({ id: 'octoberFeedId', published: 'Wed Oct 9 2024' })],
            },
            {
                id: 'feedId',
                items: [
                    itemFixture({
                        id: 'publishedLastWeekModifiedTodayId',
                        published: 'Wed Nov 13 2024',
                        lastModified: 'Fri Nov 15 2024',
                    }),
                ],
            },
            {
                id: 'feedId',
                items: [itemFixture({ id: 'yesterdayFeedId', published: 'Thu Nov 14 2024' })],
            },
            {
                id: 'feedId',
                items: [itemFixture({ id: 'novemberDayFeedId', published: 'Wed Nov 13 2024' })],
            },
        ]);

        expect(result.today[0].id).toBe('todayFeedId');
        expect(result.today[1].id).toBe('publishedLastWeekModifiedTodayId');
        expect(result.yesterday[0].id).toBe('yesterdayFeedId');
        expect(result.days[0].date).toBe('2024-11-13');
        expect(result.days[0].items[0].id).toBe('novemberDayFeedId');
        expect(result.months[0].date).toBe('2024-10');
        expect(result.months[0].items[0].id).toBe('octoberFeedId');
        expect(result.unknown[0].id).toBe('unknownFeedId');
    });
});
