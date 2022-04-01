import { PayloadAction } from '@reduxjs/toolkit';

import { Task } from 'redux-saga';
import { takeEvery, put, join, fork, select } from 'redux-saga/effects';

import { WorkerResponse } from '../../services/feedParser/workerApi';
import feedsSlice, { fetchFeedsCommand } from '../slices/feeds';
import { OptionsSliceState, selectOptions } from '../slices/options';
import sessionSlice from '../slices/session';

export function* watchfetchFeedsSaga() {
    yield takeEvery(fetchFeedsCommand.type, fetchFeeds);
}

function* fetchFeeds(action: PayloadAction<ReadonlyArray<string>>) {
    const leftToFetch = [...action.payload];

    yield put(sessionSlice.actions.changeFeedsStatus({ newStatus: 'loading', feedUrls: action.payload }));

    const options: OptionsSliceState = yield select(selectOptions);
    const fetchThreadsCount = Math.min(options.fetchThreadsCount, leftToFetch.length);
    const tasks: Task[] = [];

    for (let i = 0; i < fetchThreadsCount; i++) {
        tasks.push(yield fork(runworker, leftToFetch));
    }

    const resultSet: WorkerResponse[][] = yield join(tasks);
    const results = resultSet.flat();

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
