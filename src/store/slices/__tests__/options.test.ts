import { extensionStateLoaded } from '../../actions';
import { RootState } from '../../store';
import optionsSlice, {
    DIAGNOSIS_DAYS_MAX,
    DIAGNOSIS_DAYS_MIN,
    FETCH_THREADS_MAX,
    FETCH_THREADS_MIN,
    FEED_UPDATE_MINUTES_MAX,
    FEED_UPDATE_MINUTES_MIN,
    MAX_ITEMS_PER_FEED_DEFAULT,
    initialState,
} from '../options';

describe('options slice', () => {
    const prevState: RootState['options'] = {
        feedUpdatePeriodInMinutes: 30,
        fetchThreadsCount: 4,
        mainViewDisplayMode: 'folder-tree',
        feedDetectionEnabled: true,
        diagnosisInactiveDays: 60,
        showUnreadBadge: true,
        maxItemsPerFeed: MAX_ITEMS_PER_FEED_DEFAULT,
    };

    describe('global extensionStateLoaded action', () => {
        it('replaces previous state with payload', () => {
            const action = extensionStateLoaded({
                feeds: { folders: [], feeds: [], selectedNode: undefined },
                options: {
                    feedUpdatePeriodInMinutes: 45,
                    fetchThreadsCount: 8,
                    mainViewDisplayMode: 'plain-list',
                    feedDetectionEnabled: false,
                    diagnosisInactiveDays: 90,
                    showUnreadBadge: false,
                    maxItemsPerFeed: 100,
                },
            });

            expect(optionsSlice.reducer(prevState, action)).toStrictEqual({
                feedUpdatePeriodInMinutes: 45,
                fetchThreadsCount: 8,
                mainViewDisplayMode: 'plain-list',
                feedDetectionEnabled: false,
                diagnosisInactiveDays: 90,
                showUnreadBadge: false,
                maxItemsPerFeed: 100,
            });
        });

        it('merges missing keys of older saved state with defaults', () => {
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
                diagnosisInactiveDays: 60,
                showUnreadBadge: true,
                maxItemsPerFeed: MAX_ITEMS_PER_FEED_DEFAULT,
            });
        });
    });

    describe('changeFeedUpdatePeriodInMinutes', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeFeedUpdatePeriodInMinutes(120));
            expect(state.feedUpdatePeriodInMinutes).toBe(120);
        });

        it('clamps below minimum', () => {
            const state = optionsSlice.reducer(
                prevState,
                optionsSlice.actions.changeFeedUpdatePeriodInMinutes(FEED_UPDATE_MINUTES_MIN - 1),
            );
            expect(state.feedUpdatePeriodInMinutes).toBe(FEED_UPDATE_MINUTES_MIN);
        });

        it('clamps above maximum', () => {
            const state = optionsSlice.reducer(
                prevState,
                optionsSlice.actions.changeFeedUpdatePeriodInMinutes(FEED_UPDATE_MINUTES_MAX + 1),
            );
            expect(state.feedUpdatePeriodInMinutes).toBe(FEED_UPDATE_MINUTES_MAX);
        });
    });

    describe('changeFetchThreadsCount', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeFetchThreadsCount(2));
            expect(state.fetchThreadsCount).toBe(2);
        });

        it('clamps below minimum', () => {
            const state = optionsSlice.reducer(
                prevState,
                optionsSlice.actions.changeFetchThreadsCount(FETCH_THREADS_MIN - 1),
            );
            expect(state.fetchThreadsCount).toBe(FETCH_THREADS_MIN);
        });

        it('clamps above maximum', () => {
            const state = optionsSlice.reducer(
                prevState,
                optionsSlice.actions.changeFetchThreadsCount(FETCH_THREADS_MAX + 1),
            );
            expect(state.fetchThreadsCount).toBe(FETCH_THREADS_MAX);
        });
    });

    describe('changeFeedDetectionEnabled', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeFeedDetectionEnabled(false));
            expect(state.feedDetectionEnabled).toBe(false);
        });
    });

    describe('changeShowUnreadBadge', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeShowUnreadBadge(false));
            expect(state.showUnreadBadge).toBe(false);
        });
    });

    describe('changeMaxItemsPerFeed', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeMaxItemsPerFeed(250));
            expect(state.maxItemsPerFeed).toBe(250);
        });

        it('keeps 0 for unlimited', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeMaxItemsPerFeed(0));
            expect(state.maxItemsPerFeed).toBe(0);
        });
    });

    describe('changeDiagnosisInactiveDays', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeDiagnosisInactiveDays(30));
            expect(state.diagnosisInactiveDays).toBe(30);
        });

        it('clamps below minimum', () => {
            const state = optionsSlice.reducer(
                prevState,
                optionsSlice.actions.changeDiagnosisInactiveDays(DIAGNOSIS_DAYS_MIN - 1),
            );
            expect(state.diagnosisInactiveDays).toBe(DIAGNOSIS_DAYS_MIN);
        });

        it('clamps above maximum', () => {
            const state = optionsSlice.reducer(
                prevState,
                optionsSlice.actions.changeDiagnosisInactiveDays(DIAGNOSIS_DAYS_MAX + 1),
            );
            expect(state.diagnosisInactiveDays).toBe(DIAGNOSIS_DAYS_MAX);
        });
    });

    describe('resetOptions', () => {
        it('restores default values', () => {
            const customState: RootState['options'] = {
                ...prevState,
                feedUpdatePeriodInMinutes: 240,
                fetchThreadsCount: 1,
                mainViewDisplayMode: 'date-sorted-list',
                feedDetectionEnabled: false,
                diagnosisInactiveDays: 365,
                showUnreadBadge: false,
                maxItemsPerFeed: 10,
            };

            expect(optionsSlice.reducer(customState, optionsSlice.actions.resetOptions())).toStrictEqual(initialState);
        });
    });
});
