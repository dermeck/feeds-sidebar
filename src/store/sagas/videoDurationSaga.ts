import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { extensionStateLoaded } from '../actions';
import { fetchYoutubeDurationSeconds } from '../../services/youtube/fetchVideoDuration';
import feedsSlice, { selectYoutubeItemsMissingDuration } from '../slices/feeds';
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
    const attemptedVideoIds = new Set<string>();

    for (const candidate of pending) {
        // never fetch the same video twice in one run: failures and already-stored durations are skipped here too
        if (attemptedVideoIds.has(candidate.videoId)) {
            continue;
        }
        attemptedVideoIds.add(candidate.videoId);

        const optionsNow: ReturnType<typeof selectOptions> = yield select(selectOptions);

        if (!optionsNow.youtubeVideoDurationEnabled) {
            return;
        }

        const durationSeconds: number | undefined = yield call(fetchYoutubeDurationSeconds, candidate.videoId);

        if (durationSeconds !== undefined) {
            // in the same video appears in several feeds, store the duration on every matching item
            for (const matchedItem of pending.filter((pendingItem) => pendingItem.videoId === candidate.videoId)) {
                yield put(
                    feedsSlice.actions.setItemDuration({
                        feedId: matchedItem.feedId,
                        itemId: matchedItem.itemId,
                        durationSeconds,
                    }),
                );
            }
        }

        yield delay(REQUEST_DELAY_MS + Math.floor(Math.random() * REQUEST_DELAY_JITTER_MS));
    }
}

export function* watchVideoDurationSaga() {
    yield takeLatest(
        [
            optionsSlice.actions.changeYoutubeVideoDurationEnabled.type,
            extensionStateLoaded.type,
            feedsSlice.actions.updateFeeds.type,
        ],
        drainQueue,
    );
}