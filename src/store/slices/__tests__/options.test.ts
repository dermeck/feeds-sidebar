import { extensionStateLoaded } from '../../actions';
import optionsSlice, { OptionsSliceState } from '../options';

describe('global extensionStateLoaded action', () => {
    it('replaces previous state with payload', () => {
        const prevState: OptionsSliceState = {
            feedUpdatePeriodInMinutes: 30,
            fetchThreadsCount: 4,
            showFeedTitles: true,
        };

        const action = extensionStateLoaded({
            feeds: { folders: [], feeds: [], selectedNodeId: '' },
            options: { feedUpdatePeriodInMinutes: 45, fetchThreadsCount: 8, showFeedTitles: false },
        });

        expect(optionsSlice.reducer(prevState, action)).toStrictEqual({
            feedUpdatePeriodInMinutes: 45,
            fetchThreadsCount: 8,
            showFeedTitles: false,
        });
    });
});
