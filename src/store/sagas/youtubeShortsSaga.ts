import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { fetchYoutubeShortStatus } from '../../services/youtube/fetchVideoShortStatus';
import feedsSlice, {
    DURATION_FETCH_RETRY_WINDOW_MS,
    SHORTS_MAX_DURATION_SECONDS,
    selectShortsFetchFailures,
    selectYoutubeItemsMissingShortStatus,
    youtubeDurationsSettled,
} from '../slices/feeds';
import optionsSlice, { selectOptions } from '../slices/options';
import { REQUEST_DELAY_JITTER_MS, REQUEST_DELAY_MS } from './videoDurationSaga';

type ShortGroup = {
    videoId: string;
    durationSeconds?: number;
    items: Array<{ feedId: string; itemId: string }>;
};

// a video shared by several feeds is probed once
const groupByVideoId = (pending: ReturnType<typeof selectYoutubeItemsMissingShortStatus>) => {
    const groups = new Map<string, ShortGroup>();

    for (const item of pending) {
        const existing = groups.get(item.videoId);

        if (existing === undefined) {
            groups.set(item.videoId, {
                videoId: item.videoId,
                durationSeconds: item.durationSeconds,
                items: [{ feedId: item.feedId, itemId: item.itemId }],
            });
        } else {
            existing.items.push({ feedId: item.feedId, itemId: item.itemId });

            if (existing.durationSeconds === undefined) {
                existing.durationSeconds = item.durationSeconds;
            }
        }
    }

    return groups;
};

function* drainQueue() {
    if (process.env.STAND_ALONE) {
        // the stand-alone web build has no extension network privilege, so the probe would fail CORS
        return;
    }

    const options: ReturnType<typeof selectOptions> = yield select(selectOptions);

    if (!options.youtubeShortsFilterEnabled) {
        return;
    }

    const pending: ReturnType<typeof selectYoutubeItemsMissingShortStatus> = yield select(
        selectYoutubeItemsMissingShortStatus,
    );
    const failures: ReturnType<typeof selectShortsFetchFailures> = yield select(selectShortsFetchFailures);
    const now = Date.now();

    const groups = groupByVideoId(pending);
    const dueVideoIds: string[] = [];
    const eliminated: Array<{ feedId: string; itemId: string; isShort: boolean }> = [];

    for (const group of groups.values()) {
        // a video longer than the shorts ceiling cannot be a short, so no request is needed
        if (group.durationSeconds !== undefined && group.durationSeconds > SHORTS_MAX_DURATION_SECONDS) {
            for (const item of group.items) {
                eliminated.push({ ...item, isShort: false });
            }
            continue;
        }

        const failedAt = failures[group.videoId];

        // a video that just failed is left alone until its retry window passes
        if (failedAt === undefined || now - failedAt >= DURATION_FETCH_RETRY_WINDOW_MS) {
            dueVideoIds.push(group.videoId);
        }
    }

    const maxPerRun = options.youtubeShortsMaxPerRun;
    const videosToFetch = maxPerRun > 0 ? dueVideoIds.slice(0, maxPerRun) : dueVideoIds;

    // one write for the whole elimination pass, so a large backlog does not cause a write per item
    if (eliminated.length > 0) {
        yield put(feedsSlice.actions.setItemsShortStatus(eliminated));
    }

    for (const videoId of videosToFetch) {
        const optionsNow: ReturnType<typeof selectOptions> = yield select(selectOptions);

        if (!optionsNow.youtubeShortsFilterEnabled) {
            return;
        }

        const isShort: boolean | undefined = yield call(fetchYoutubeShortStatus, videoId);
        const group = groups.get(videoId);

        if (isShort !== undefined) {
            yield put(feedsSlice.actions.clearShortsFetchFailure(videoId));

            const updates = (group?.items ?? []).map((item) => ({ ...item, isShort }));

            if (updates.length > 0) {
                yield put(feedsSlice.actions.setItemsShortStatus(updates));
            }
        } else {
            yield put(feedsSlice.actions.recordShortsFetchFailure({ videoId, failedAt: Date.now() }));
        }

        yield delay(REQUEST_DELAY_MS + Math.floor(Math.random() * REQUEST_DELAY_JITTER_MS));
    }
}

export function* watchYoutubeShortsSaga() {
    yield takeLatest(
        [
            youtubeDurationsSettled.type,
            optionsSlice.actions.changeYoutubeShortsFilterEnabled.type,
            optionsSlice.actions.changeYoutubeShortsMaxPerRun.type,
        ],
        drainQueue,
    );
}
