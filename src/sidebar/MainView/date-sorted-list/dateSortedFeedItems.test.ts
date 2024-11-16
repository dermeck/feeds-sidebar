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

    it('assigns items  that are older than 2 days and newer than 7 days to "lastWeek"', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [itemFixture({ id: 'lastWeekFeedId', published: 'Wed Nov 13 2024' })],
            },
        ]);

        expect(result.lastWeek[0].id).toBe('lastWeekFeedId');
    });

    it('assigns items that are older than 1 week to "older"', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() => Date.parse('2024-11-15'));

        const result = getDateSortedFeedItems([
            {
                id: 'feedId',
                items: [itemFixture({ id: 'olderFeedId', published: 'Wed Nov 6 2024' })],
            },
        ]);

        expect(result.older[0].id).toBe('olderFeedId');
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

    it('Sorts multiple items', () => {
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
                items: [itemFixture({ id: 'olderFeedId', published: 'Wed Nov 6 2024' })],
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
        ]);

        expect(result.today[0].id).toBe('todayFeedId');
        expect(result.today[1].id).toBe('publishedLastWeekModifiedTodayId');
        expect(result.yesterday[0].id).toBe('yesterdayFeedId');
        expect(result.older[0].id).toBe('olderFeedId');
        expect(result.unknown[0].id).toBe('unknownFeedId');
    });
});
