import { Action } from '@reduxjs/toolkit';

import { eventChannel, runSaga } from 'redux-saga';
import { takeEvery } from 'redux-saga/effects';

import fetchFeedWorkerSaga from './fetchFeedWorkerSaga';

runSaga(
    {
        channel: eventChannel((emit) => {
            self.onmessage = (e: MessageEvent<Action>) => emit(e.data);
            return () => undefined;
        }),
        dispatch(message: Action) {
            self.postMessage(message);
        },
    },
    workerCommandsWatcher,
);

function* workerCommandsWatcher() {
    yield takeEvery('worker/fetchFeed', fetchFeedWorkerSaga);
}
