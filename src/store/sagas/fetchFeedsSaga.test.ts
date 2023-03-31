import { expectSaga } from 'redux-saga-test-plan';
import { select } from 'redux-saga/effects';

import { rootSaga } from '../sagas/index';
import { fetchFeedsCommand } from '../slices/feeds';
import * as optionsSliceModule from '../slices/options';
import sessionSlice from '../slices/session';
import * as createWorkerModule from './worker/createWorker';

it('sets all fetched feeds to "loading"', () => {
    const workerMock = {
        postMessage: jest.fn(),
        terminate: jest.fn(),
    };

    jest.spyOn(createWorkerModule, 'createWorker').mockImplementation(() => workerMock as unknown as Worker);

    return expectSaga(rootSaga)
        .provide([
            [
                select(optionsSliceModule.selectOptions),
                {
                    ...optionsSliceModule.initialState,
                    fetchThreadsCount: 1,
                },
            ],
        ])
        .put(sessionSlice.actions.changeFeedsStatus({ newStatus: 'loading', feedUrls: ['feed1.url', 'feed2.url'] }))
        .dispatch(fetchFeedsCommand(['feed1.url', 'feed2.url']))
        .run();
});
