import { takeEvery } from 'redux-saga/effects';

import optionsSlice from '../slices/options';

export const feedsAutoUpdateKey = 'feedsAutoUpdate';

function* recreateAutoUpdateAlarm(action: { payload: number }) {
    if (process.env.STAND_ALONE) {
        return;
    }

    const periodInMinutes = action.payload;

    yield browser.alarms.clear(feedsAutoUpdateKey);
    yield browser.alarms.create(feedsAutoUpdateKey, { periodInMinutes });
}

export function* watchOptionsSaga() {
    yield takeEvery(optionsSlice.actions.changeFeedUpdatePeriodInMinutes, recreateAutoUpdateAlarm);
}