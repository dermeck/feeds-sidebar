import { extensionStateLoaded } from '../../actions';
import { RootState } from '../../store';
import optionsSlice from '../options';

describe('global extensionStateLoaded action', () => {
    it('replaces previous state with payload', () => {
        const prevState: RootState['options'] = {
            feedUpdatePeriodInMinutes: 30,
            fetchThreadsCount: 4,
            mainViewDisplayMode: 'folder-tree',
            feedDetectionEnabled: true,
        };

        const action = extensionStateLoaded({
            feeds: { folders: [], feeds: [], selectedNode: undefined },
            options: {
                feedUpdatePeriodInMinutes: 45,
                fetchThreadsCount: 8,
                mainViewDisplayMode: 'plain-list',
                feedDetectionEnabled: false,
            },
        });

        expect(optionsSlice.reducer(prevState, action)).toStrictEqual({
            feedUpdatePeriodInMinutes: 45,
            fetchThreadsCount: 8,
            mainViewDisplayMode: 'plain-list',
            feedDetectionEnabled: false,
        });
    });
});
