import { PayloadAction } from '@reduxjs/toolkit';

import { Task } from 'redux-saga';
import { takeEvery, put, join, fork, select } from 'redux-saga/effects';

import feedsSlice, { fetchFeedsCommand } from '../slices/feeds';
import { selectOptions } from '../slices/options';
import sessionSlice from '../slices/session';
import { RootState } from '../store';
import { createWorker } from './worker/createWorker';
import { WorkerRequestAction, WorkerResponseAction } from './worker/workerApi';

export function* watchfetchFeedsSaga() {
    yield takeEvery(fetchFeedsCommand.type, fetchFeeds);
}

function* fetchFeeds(action: PayloadAction<ReadonlyArray<string>>) {
    const leftToFetch = [...action.payload];

    yield put(sessionSlice.actions.changeFeedsStatus({ newStatus: 'loading', feedUrls: action.payload }));

    const options: RootState['options'] = yield select(selectOptions);
    const fetchThreadsCount = Math.min(options.fetchThreadsCount, leftToFetch.length);
    const tasks: Task[] = [];

    for (let i = 0; i < fetchThreadsCount; i++) {
        tasks.push(yield fork(runworker, leftToFetch));
    }

    const resultSet: WorkerResponseAction[][] = yield join(tasks);
    const results = resultSet.flat();

    const now = new Date().toISOString();
    const updatePayload = results.flatMap((r) => (r.type === 'success' ? [{ ...r.parsedFeed, lastFetched: now }] : []));
    yield put(feedsSlice.actions.updateFeeds(updatePayload));
    yield put(
        sessionSlice.actions.changeFeedsStatus({
            newStatus: 'loaded',
            feedUrls: updatePayload.map((feed) => feed.id),
        }),
    );

    yield put(
        sessionSlice.actions.changeFeedsStatus({
            newStatus: 'error',
            feedUrls: results.flatMap((r) => (r.type !== 'success' ? [r.url] : [])),
        }),
    );
}

const runworker = async (leftToFetch: string[]): Promise<WorkerResponseAction[]> => {
    const worker = createWorker();

    const results: WorkerResponseAction[] = [];

    while (leftToFetch.length > 0) {
        const url = leftToFetch.shift();

        if (url === undefined) {
            throw new Error('not reachable.');
        }

        const message: WorkerRequestAction = { type: 'worker/fetchFeed', url };
        worker.postMessage(message);

        const result = await new Promise<WorkerResponseAction>((resolve) => {
            worker.onmessage = (e: MessageEvent<WorkerResponseAction>) => {
                resolve(e.data);
            };
        });

        results.push(result);
    }

    worker.terminate();

    return results;
};
