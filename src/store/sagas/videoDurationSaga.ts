import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { extensionStateLoaded } from '../actions';
import { fetchYoutubeDurationSeconds } from '../../services/youtube/fetchVideoDuration';
import feedsSlice, {
    DURATION_FETCH_RETRY_WINDOW_MS,
    selectDurationFetchFailures,
    selectYoutubeItemsMissingDuration,
} from '../slices/feeds';
import optionsSlice, { selectOptions } from '../slices/options';

// delays between individual watch-page requests, so a large backlog does not hammer youtube
export const REQUEST_DELAY_MS = 700;
export const REQUEST_DELAY_JITTER_MS = 300;

function* drainQueue() {
    if (process.env.STAND_ALONE) {
        // the stand-alone web build has no extension network privilege, so the scrape would fail CORS
        return;
    }

    const options: ReturnType<typeof selectOptions> = yield select(selectOptions);

    if (!options.youtubeVideoDurationEnabled) {
        return;
    }

    const pending: ReturnType<typeof selectYoutubeItemsMissingDuration> = yield select(selectYoutubeItemsMissingDuration);
    const failures: ReturnType<typeof selectDurationFetchFailures> = yield select(selectDurationFetchFailures);
    const now = Date.now();

    const dueVideoIds = Array.from(new Set(pending.map((item) => item.videoId))).filter((videoId) => {
        const failedAt = failures[videoId];

        // a video that just failed is left alone until its retry window passes
        return failedAt === undefined || now - failedAt >= DURATION_FETCH_RETRY_WINDOW_MS;
    });

    // a video shared by several feeds is fetched once, so the cap counts videos, not items
    const maxPerRun = options.youtubeVideoDurationMaxPerRun;
    const videosToFetch = maxPerRun > 0 ? dueVideoIds.slice(0, maxPerRun) : dueVideoIds;

    for (const videoId of videosToFetch) {
        const optionsNow: ReturnType<typeof selectOptions> = yield select(selectOptions);

        if (!optionsNow.youtubeVideoDurationEnabled) {
            return;
        }

        const durationSeconds: number | undefined = yield call(fetchYoutubeDurationSeconds, videoId);

        if (durationSeconds !== undefined) {
            yield put(feedsSlice.actions.clearDurationFetchFailure(videoId));

            // if the same video appears in several feeds, store the duration on every matching item
            for (const matchedItem of pending.filter((pendingItem) => pendingItem.videoId === videoId)) {
                yield put(
                    feedsSlice.actions.setItemDuration({
                        feedId: matchedItem.feedId,
                        itemId: matchedItem.itemId,
                        durationSeconds,
                    }),
                );
            }
        } else {
            yield put(feedsSlice.actions.recordDurationFetchFailure({ videoId, failedAt: Date.now() }));
        }

        yield delay(REQUEST_DELAY_MS + Math.floor(Math.random() * REQUEST_DELAY_JITTER_MS));
    }
}

export function* watchVideoDurationSaga() {
    yield takeLatest(
        [
            optionsSlice.actions.changeYoutubeVideoDurationEnabled.type,
            optionsSlice.actions.changeYoutubeVideoDurationScope.type,
            optionsSlice.actions.changeYoutubeVideoDurationMaxPerRun.type,
            extensionStateLoaded.type,
            feedsSlice.actions.updateFeeds.type,
        ],
        drainQueue,
    );
}