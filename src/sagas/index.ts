import { fork, all } from 'redux-saga/effects';

import { watchfetchFeedsSaga } from './fetchFeedsSaga';

export function* rootSaga() {
    yield all([fork(watchfetchFeedsSaga)]);
}
