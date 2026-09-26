import { select, takeEvery } from 'redux-saga/effects';

import optionsSlice, { selectOptions } from '../slices/options';

export const feedsAutoUpdateKey = 'feedsAutoUpdate';

function* recreateAutoUpdateAlarm() {
    if (process.env.STAND_ALONE) {
        return;
    }

    // the period is taken from the state, because the reducer clamps the payload and resetOptions has none
    const options: ReturnType<typeof selectOptions> = yield select(selectOptions);
    const periodInMinutes = options.feedUpdatePeriodInMinutes;

    try {
        yield browser.alarms.clear(feedsAutoUpdateKey);
        yield browser.alarms.create(feedsAutoUpdateKey, { periodInMinutes });
    } catch (e) {
        console.error(e);
    }
}

export function* watchOptionsSaga() {
    yield takeEvery(
        [optionsSlice.actions.changeFeedUpdatePeriodInMinutes.type, optionsSlice.actions.resetOptions.type],
        recreateAutoUpdateAlarm,
    );
}
