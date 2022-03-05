import { PayloadAction } from '@reduxjs/toolkit';

import { Task } from 'redux-saga';
import { takeEvery, fork, join, put } from 'redux-saga/effects';

import { fetchFeed, FetchFeedResult } from '../../services/api';
import parseFeed, { ParseFeedResult } from '../../services/feedParser';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import feedsSlice, { fetchFeedsCommand, Feed } from '../slices/feeds';

export function* watchfetchFeedsSaga() {
    yield takeEvery(fetchFeedsCommand.type, fetchFeeds);
}

function* fetchFeeds(action: PayloadAction<ReadonlyArray<string>>) {
    const fetchTasks: Task[] = [];

    for (const url of action.payload) {
        fetchTasks.push(yield fork(fetchFeed, url));
    }

    const fetchResults: ReadonlyArray<FetchFeedResult> = yield join([...fetchTasks]);
    const parseFeedTasks: Task[] = [];

    for (const fetchResult of fetchResults) {
        switch (fetchResult.type) {
            case 'success':
                parseFeedTasks.push(
                    yield fork(parseFeed, { feedUrl: fetchResult.url, feedData: fetchResult.response }),
                );

                break;

            case 'error':
                // TODO handler error
                break;

            default:
                throw new UnreachableCaseError(fetchResult);
        }
    }

    const parseResults: ReadonlyArray<ParseFeedResult> = yield join([...parseFeedTasks]);

    const updatePayload = parseResults
        .map((x) => {
            if (x.type === 'success') {
                return x.parsedFeed;
            }
        })
        .filter((y) => y !== undefined) as Feed[];

    yield put(feedsSlice.actions.updateFeeds(updatePayload));
}
