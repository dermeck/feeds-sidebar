import feedsSlice from '../feeds';
import { RootState } from '../../store';
import sessionSlice, { initialState } from '../session';

describe('changeFeedsStatus action', () => {
    it('adds entry if url status is not already tracked', () => {
        const prevState: RootState['session'] = {
            ...initialState,
            feedStatus: [],
        };

        const action = sessionSlice.actions.changeFeedsStatus({
            newStatus: 'loading',
            feedUrls: ['first.url', 'second.url'],
        });

        expect(sessionSlice.reducer(prevState, action).feedStatus).toEqual([
            { url: 'first.url', status: 'loading' },
            { url: 'second.url', status: 'loading' },
        ]);
    });

    it('replaces entry if url status is already tracked', () => {
        const prevState: RootState['session'] = {
            ...initialState,
            feedStatus: [
                { url: 'first.url', status: 'loaded' },
                { url: 'second.url', status: 'loaded' },
            ],
        };

        const action = sessionSlice.actions.changeFeedsStatus({
            newStatus: 'loading',
            feedUrls: ['first.url', 'second.url'],
        });

        expect(sessionSlice.reducer(prevState, action).feedStatus).toEqual([
            { url: 'first.url', status: 'loading' },
            { url: 'second.url', status: 'loading' },
        ]);
    });
});

describe('deleteFeed action', () => {
    it('removes the status entry of the deleted feed', () => {
        const prevState: RootState['session'] = {
            ...initialState,
            feedStatus: [
                { url: 'first.url', status: 'error' },
                { url: 'second.url', status: 'loaded' },
            ],
        };

        const action = feedsSlice.actions.deleteFeed({ url: 'first.url' });

        expect(sessionSlice.reducer(prevState, action).feedStatus).toEqual([{ url: 'second.url', status: 'loaded' }]);
    });
});

describe('feedsDetected action', () => {
    const detected = [
        { type: 'application/rss+xml', href: 'https://example.com/feed', title: 'Example' },
        { type: 'application/atom+xml', href: 'https://example.org/feed', title: 'Other' },
    ];

    it('keeps the same state for a list that did not change', () => {
        const prevState: RootState['session'] = { ...initialState, detectedFeeds: [...detected] };

        const newState = sessionSlice.reducer(prevState, sessionSlice.actions.feedsDetected([...detected]));

        // same state, so subscribers are not notified and nothing is persisted
        expect(newState).toBe(prevState);
    });

    it('keeps the same state for an empty list when none was detected', () => {
        const prevState: RootState['session'] = { ...initialState, detectedFeeds: [] };

        const newState = sessionSlice.reducer(prevState, sessionSlice.actions.feedsDetected([]));

        expect(newState).toBe(prevState);
    });

    it.each([
        ['a different feed', [detected[1], detected[0]]],
        ['a different title', [{ ...detected[0], title: 'Renamed' }, detected[1]]],
        ['a different type', [{ ...detected[0], type: 'text/xml' }, detected[1]]],
        ['a removed feed', [detected[0]]],
        ['an added feed', [...detected, { type: 'application/rss+xml', href: 'https://new.url', title: 'New' }]],
    ])('changes the state for %s', (_, payload) => {
        const prevState: RootState['session'] = { ...initialState, detectedFeeds: [...detected] };

        const newState = sessionSlice.reducer(prevState, sessionSlice.actions.feedsDetected(payload));

        expect(newState).not.toBe(prevState);
        expect(newState.detectedFeeds).toStrictEqual(payload);
    });
});
