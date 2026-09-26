import { fork, all } from 'redux-saga/effects';

import { watchfetchFeedsSaga } from './fetchFeedsSaga';
import { watchOptionsSaga } from './optionsSaga';

export function* rootSaga() {
    yield all([fork(watchfetchFeedsSaga), fork(watchOptionsSaga)]);
}
