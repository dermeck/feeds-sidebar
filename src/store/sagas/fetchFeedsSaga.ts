import { PayloadAction } from '@reduxjs/toolkit';

import { takeEvery, put, call } from 'redux-saga/effects';

import { WorkerResponse } from '../../services/feedParser/workerApi';
import feedsSlice, { fetchFeedsCommand } from '../slices/feeds';
import sessionSlice from '../slices/session';

export function* watchfetchFeedsSaga() {
    yield takeEvery(fetchFeedsCommand.type, fetchFeeds);
}

function* fetchFeeds(action: PayloadAction<ReadonlyArray<string>>) {
    const leftToFetch = [...action.payload];

    yield put(sessionSlice.actions.changeFeedsStatus({ newStatus: 'loading', feedUrls: action.payload }));

    const results: WorkerResponse[] = yield call(runworker, leftToFetch);

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
            throw new Error('moep');
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
