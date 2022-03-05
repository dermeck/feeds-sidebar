import { PayloadAction } from '@reduxjs/toolkit';

import { Task } from 'redux-saga';
import { takeEvery, fork, join, put } from 'redux-saga/effects';

import { fetchFeed, FetchFeedResult } from '../../services/api';
import parseFeed, { ParseFeedResult } from '../../services/feedParser';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import feedsSlice, { fetchFeedsCommand, Feed } from '../slices/feeds';
import sessionSlice from '../slices/session';

export function* watchfetchFeedsSaga() {
    yield takeEvery(fetchFeedsCommand.type, fetchFeeds);
}

function* fetchFeeds(action: PayloadAction<ReadonlyArray<string>>) {
    const fetchTasks: Task[] = [];

    yield put(sessionSlice.actions.changeFeedsStatus({ newStatus: 'loading', feedUrls: action.payload }));

    for (const url of action.payload) {
        fetchTasks.push(yield fork(fetchFeed, url));
    }

    const fetchResults: ReadonlyArray<FetchFeedResult> = yield join([...fetchTasks]);
    const parseFeedTasks: Task[] = [];
    const fetchFeedErrorUrls: string[] = [];

    for (const fetchResult of fetchResults) {
        switch (fetchResult.type) {
            case 'success':
                parseFeedTasks.push(
                    yield fork(parseFeed, { feedUrl: fetchResult.url, feedData: fetchResult.response }),
                );
                break;

            case 'error':
                fetchFeedErrorUrls.push(fetchResult.url);
                break;

            default:
                throw new UnreachableCaseError(fetchResult);
        }
    }

    const parseResults: ReadonlyArray<ParseFeedResult> = yield join([...parseFeedTasks]);

    // TODO handle errors!

    const updatePayload = parseResults
        .map((x) => {
            if (x.type === 'success') {
                return x.parsedFeed;
            }

            fetchFeedErrorUrls.push(x.url);
        })
        .filter((y) => y !== undefined) as Feed[];

    yield put(feedsSlice.actions.updateFeeds(updatePayload));
    yield put(
        sessionSlice.actions.changeFeedsStatus({
            newStatus: 'loaded',
            feedUrls: updatePayload.map((feed) => feed.url),
        }),
    );
    yield put(
        sessionSlice.actions.changeFeedsStatus({
            newStatus: 'error',
            feedUrls: fetchFeedErrorUrls,
        }),
    );
}
