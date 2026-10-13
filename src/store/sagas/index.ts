import { fork, all } from 'redux-saga/effects';

import { watchfetchFeedsSaga } from './fetchFeedsSaga';
import { watchOptionsSaga } from './optionsSaga';
import { watchVideoDurationSaga } from './videoDurationSaga';
import { watchYoutubeShortsSaga } from './youtubeShortsSaga';

export function* rootSaga() {
    yield all([
        fork(watchfetchFeedsSaga),
        fork(watchOptionsSaga),
        fork(watchVideoDurationSaga),
        fork(watchYoutubeShortsSaga),
    ]);
}
