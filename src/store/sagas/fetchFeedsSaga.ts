import { PayloadAction } from '@reduxjs/toolkit';

import { takeEvery, put, join, fork, select } from 'redux-saga/effects';

import { WorkerResponse } from '../../services/feedParser/workerApi';
import feedsSlice, { fetchFeedsCommand } from '../slices/feeds';
import { selectOptions } from '../slices/options';
import sessionSlice from '../slices/session';

export function* watchfetchFeedsSaga() {
    yield takeEvery(fetchFeedsCommand.type, fetchFeeds);
}

function* fetchFeeds(action: PayloadAction<ReadonlyArray<string>>): any {
    const leftToFetch = [...action.payload];

    yield put(sessionSlice.actions.changeFeedsStatus({ newStatus: 'loading', feedUrls: action.payload }));

    const fetchThreadsCount = Math.min((yield select(selectOptions)).fetchThreadsCount, leftToFetch.length);
    const tasks = [];

    for (let i = 0; i < fetchThreadsCount; i++) {
        tasks.push(yield fork(runworker, leftToFetch));
    }

    const results: WorkerResponse[] = (yield join(tasks)).flat();

    const updatePayload = results.flatMap((r) => (r.type === 'success' ? [r.parsedFeed] : []));
    yield put(feedsSlice.actions.updateFeeds(updatePayload));
    yield put(
        sessionSlice.actions.changeFeedsStatus({
            newStatus: 'loaded',
            feedUrls: updatePayload.map((feed) => feed.url),
        }),
    );

    yield put(
        sessionSlice.actions.changeFeedsStatus({
            newStatus: 'error',
            feedUrls: results.flatMap((r) => (r.type !== 'success' ? [r.url] : [])),
        }),
    );
}

const runworker = async (leftToFetch: string[]): Promise<WorkerResponse[]> => {
    const worker = new Worker(new URL('../../services/feedParser/worker.ts', import.meta.url));

    const results: WorkerResponse[] = [];

    while (leftToFetch.length > 0) {
        const nextUrl = leftToFetch.shift();

        if (nextUrl === undefined) {
            throw new Error('not reachable.');
        }

        worker.postMessage(nextUrl);

        const result = await new Promise<WorkerResponse>((resolve) => {
            worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
                resolve(e.data);
            };
        });

        results.push(result);
    }

    worker.terminate();

    return results;
};
