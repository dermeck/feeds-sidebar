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
