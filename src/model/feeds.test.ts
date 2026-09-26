import { Feed, isFetchDue } from './feeds';

const now = Date.parse('2024-05-01T12:00:00.000Z');
const updateIntervalMs = 30 * 60 * 1000;

const feedFetched = (lastFetched?: string) => ({ id: 'feed', title: 'a feed', items: [], lastFetched });

const isDue = (feeds: ReadonlyArray<Feed>) => isFetchDue(feeds, updateIntervalMs, now);

describe('isFetchDue', () => {
    it('is not due while the last fetch is inside the interval', () => {
        const feeds = [
            feedFetched(new Date(now - updateIntervalMs + 1000).toISOString()),
            feedFetched(new Date(now - 1000).toISOString()),
        ];

        expect(isDue(feeds)).toBe(false);
    });

    it('is due when the last fetch is older than the interval', () => {
        const feeds = [
            feedFetched(new Date(now - updateIntervalMs - 1000).toISOString()),
            feedFetched(new Date(now - 2 * updateIntervalMs).toISOString()),
        ];

        expect(isDue(feeds)).toBe(true);
    });

    it.each([
        ['there are no feeds', []],
        ['no feed has been fetched', [feedFetched(), feedFetched()]],
        ['a lastFetched is unusable', [feedFetched(), feedFetched('not a date')]],
    ])('is due when %s', (_, feeds) => {
        expect(isDue(feeds)).toBe(true);
    });

    it('is not due because of a feed that never succeeds', () => {
        // this feed is fetched on every pass and never succeeds, so it must not keep the gate open
        const feeds = [
            feedFetched(new Date(now - 1000).toISOString()),
            feedFetched(new Date(now - 10 * updateIntervalMs).toISOString()),
        ];

        expect(isDue(feeds)).toBe(false);
    });

    it('ignores state changes, only the last fetch counts', () => {
        const feeds = [feedFetched(new Date(now - updateIntervalMs - 1000).toISOString())];

        expect(isDue(feeds)).toBe(true);
        expect(isDue([{ ...feeds[0], items: [{ id: 'item', title: 'read', url: 'url', isRead: true }] }])).toBe(true);
    });
});
