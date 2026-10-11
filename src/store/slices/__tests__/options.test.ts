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
    YOUTUBE_DURATION_MAX_PER_RUN_DEFAULT,
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
        youtubeVideoDurationEnabled: false,
        youtubeVideoDurationScope: 'unread',
        youtubeVideoDurationMaxPerRun: YOUTUBE_DURATION_MAX_PER_RUN_DEFAULT,
        maxItemsPerFeed: MAX_ITEMS_PER_FEED_DEFAULT,
        sidebarSurface: 'auto',
        sidebarCustomColorLight: '#ffffff',
        sidebarCustomColorDark: '#2b2a33',
        dateGroupCardStyle: 'flat',
    };

    describe('global extensionStateLoaded action', () => {
        it('replaces previous state with payload', () => {
            const action = extensionStateLoaded({
                feeds: { folders: [], feeds: [], selectedNode: undefined, readItemIds: [], durationFetchFailures: {} },
                options: {
                    feedUpdatePeriodInMinutes: 45,
                    fetchThreadsCount: 8,
                    mainViewDisplayMode: 'plain-list',
                    feedDetectionEnabled: false,
                    diagnosisInactiveDays: 90,
                    showUnreadBadge: false,
                    maxItemsPerFeed: 100,
                    sidebarSurface: 'system-theme',
                    dateGroupCardStyle: 'raised',
                },
            });

            expect(optionsSlice.reducer(prevState, action)).toStrictEqual({
                feedUpdatePeriodInMinutes: 45,
                fetchThreadsCount: 8,
                mainViewDisplayMode: 'plain-list',
                feedDetectionEnabled: false,
                diagnosisInactiveDays: 90,
                showUnreadBadge: false,
                youtubeVideoDurationEnabled: false,
                youtubeVideoDurationScope: 'unread',
                youtubeVideoDurationMaxPerRun: YOUTUBE_DURATION_MAX_PER_RUN_DEFAULT,
                maxItemsPerFeed: 100,
                sidebarSurface: 'system-theme',
                sidebarCustomColorLight: '#ffffff',
                sidebarCustomColorDark: '#2b2a33',
                dateGroupCardStyle: 'raised',
            });
        });

        it('merges missing keys of older saved state with defaults', () => {
            const action = extensionStateLoaded({
                feeds: { folders: [], feeds: [], selectedNode: undefined, readItemIds: [], durationFetchFailures: {} },
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
                youtubeVideoDurationEnabled: false,
                youtubeVideoDurationScope: 'unread',
                youtubeVideoDurationMaxPerRun: YOUTUBE_DURATION_MAX_PER_RUN_DEFAULT,
                maxItemsPerFeed: MAX_ITEMS_PER_FEED_DEFAULT,
                sidebarSurface: 'auto',
                sidebarCustomColorLight: '#ffffff',
                sidebarCustomColorDark: '#2b2a33',
                dateGroupCardStyle: 'flat',
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

    describe('changeYoutubeVideoDurationEnabled', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeYoutubeVideoDurationEnabled(true));
            expect(state.youtubeVideoDurationEnabled).toBe(true);
        });
    });

    describe('changeYoutubeVideoDurationScope', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeYoutubeVideoDurationScope('all'));
            expect(state.youtubeVideoDurationScope).toBe('all');
        });
    });

    describe('changeYoutubeVideoDurationMaxPerRun', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(
                prevState,
                optionsSlice.actions.changeYoutubeVideoDurationMaxPerRun(100),
            );
            expect(state.youtubeVideoDurationMaxPerRun).toBe(100);
        });

        it('keeps 0 for no limit', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeYoutubeVideoDurationMaxPerRun(0));
            expect(state.youtubeVideoDurationMaxPerRun).toBe(0);
        });

        it('rounds fractions and clamps negatives to 0', () => {
            expect(
                optionsSlice.reducer(prevState, optionsSlice.actions.changeYoutubeVideoDurationMaxPerRun(0.5))
                    .youtubeVideoDurationMaxPerRun,
            ).toBe(1);
            expect(
                optionsSlice.reducer(prevState, optionsSlice.actions.changeYoutubeVideoDurationMaxPerRun(-5))
                    .youtubeVideoDurationMaxPerRun,
            ).toBe(0);
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

        it('rounds a fractional value, which would otherwise trim every item', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeMaxItemsPerFeed(0.5));
            expect(state.maxItemsPerFeed).toBe(1);
        });

        it('clamps a negative value to 0', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.changeMaxItemsPerFeed(-5));
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

    describe('sidebarSurfaceChanged', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.sidebarSurfaceChanged('system-theme'));
            expect(state.sidebarSurface).toBe('system-theme');
        });
    });

    describe.each([
        ['Light', 'sidebarCustomColorLight', 'sidebarCustomColorLightChanged'],
        ['Dark', 'sidebarCustomColorDark', 'sidebarCustomColorDarkChanged'],
    ] as const)('%s custom color', (_name, stateKey, actionName) => {
        const action = (value: string) => optionsSlice.actions[actionName](value);

        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, action('#aabbcc'));
            expect(state[stateKey]).toBe('#aabbcc');
        });

        it('normalizes case and surrounding whitespace', () => {
            const state = optionsSlice.reducer(prevState, action('  #AABBCC '));
            expect(state[stateKey]).toBe('#aabbcc');
        });

        it('keeps the previous value when the color is not a hex color', () => {
            const state = optionsSlice.reducer(prevState, action('rebeccapurple'));
            expect(state[stateKey]).toBe(prevState[stateKey]);
        });

        it('keeps the previous value for shorthand and non-hex notations', () => {
            expect(optionsSlice.reducer(prevState, action('#abc'))[stateKey]).toBe(prevState[stateKey]);
            expect(optionsSlice.reducer(prevState, action('rgb(1, 2, 3)'))[stateKey]).toBe(prevState[stateKey]);
        });
    });

    describe('dateGroupCardStyleChanged', () => {
        it('sets the value', () => {
            const state = optionsSlice.reducer(prevState, optionsSlice.actions.dateGroupCardStyleChanged('raised'));
            expect(state.dateGroupCardStyle).toBe('raised');
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
                sidebarSurface: 'builtin-theme',
                dateGroupCardStyle: 'raised',
            };

            expect(optionsSlice.reducer(customState, optionsSlice.actions.resetOptions())).toStrictEqual(initialState);
        });
    });
});
