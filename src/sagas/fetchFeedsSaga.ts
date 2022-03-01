import { PayloadAction } from '@reduxjs/toolkit';
import deepEqual from 'fast-deep-equal';

import { Task } from 'redux-saga';
import { takeEvery, call, fork, join, put, select } from 'redux-saga/effects';

import { fetchFeed, FetchFeedResult } from '../services/api';
import parseFeed from '../services/feedParser';
import feedsSlice, { fetchFeedsCommand, Feed, selectFeeds } from '../store/slices/feeds';
import sessionSlice from '../store/slices/session';

export function* watchfetchFeedsSaga() {
    yield takeEvery(fetchFeedsCommand.type, fetchFeeds);
}

function* fetchFeeds(action: PayloadAction<ReadonlyArray<string>>) {
    const fetchTasks: Task[] = [];

    for (const url of action.payload) {
        fetchTasks.push(yield fork(fetchFeed, url));
    }

    const results: ReadonlyArray<FetchFeedResult> = yield join([...fetchTasks]);

    for (const result of results) {
        if (result.type === 'error') {
            yield put(sessionSlice.actions.feedParseError(result.url)); // TODO Fetch Error
            return;
        }

        try {
            const parsedFeed: Feed = yield call(parseFeed, { feedUrl: result.url, feedData: result.response });
            const feeds: ReadonlyArray<Feed> = yield select(selectFeeds);
            const prevFeed = feeds.find((f) => f.url === parsedFeed.url);

            if (!deepEqual(prevFeed, parsedFeed)) {
                // TODO adapt to dispatch batch update action instead if many single updates
                yield put(feedsSlice.actions.updateFeed(parsedFeed));
            }
        } catch (e) {
            // response is not a feed
            yield put(sessionSlice.actions.feedParseError(result.url));
        }
    }
}
