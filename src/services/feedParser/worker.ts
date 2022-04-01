import { Action } from '@reduxjs/toolkit';
import FeedParser, { Item } from 'feedparser';

import { eventChannel, runSaga } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import { Feed, FeedItem } from '../../store/slices/feeds';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import { fetchFeed, FetchFeedResult } from './fetchFeed';
import { WorkerResponse } from './workerApi';

interface FeedParserInput {
    feedUrl: string;
    feedData: string;
}

const channel = eventChannel((emit) => {
    self.onmessage = (e: MessageEvent<string>) => emit(e.data);
    return () => {
        throw new Error('cannot unsubscribe, haha');
    };
});

runSaga(
    {
        channel,
        dispatch(message: Action) {
            self.postMessage(message);
        },
        getState() {
            throw new Error('getState not implemented');
        },
    },
    workerCommandsWatcher,
);

function* workerCommandsWatcher() {
    yield takeEvery('worker/fetchFeed', fetchFeedSaga);
}

function* fetchFeedSaga(action: any) {
    const feedUrl = action.payload;
    console.log('workerSaga started', feedUrl);

    const fetchResult: FetchFeedResult = yield call(fetchFeed, feedUrl);

    switch (fetchResult.type) {
        case 'success': {
            try {
                const parsedFeed: Feed = yield call(callFeedParser, {
                    feedUrl: fetchResult.url,
                    feedData: fetchResult.response,
                });
                yield put<WorkerResponse>({ type: 'success', parsedFeed });
            } catch (e) {
                // response is not a feed
                yield put<WorkerResponse>({ type: 'parseError', url: fetchResult.url });
            }
            break;
        }

        case 'error': {
            yield put<WorkerResponse>({ type: 'fetchError', url: fetchResult.url });
            break;
        }

        default:
            throw new UnreachableCaseError(fetchResult);
    }
}

const mapFeedItem = (item: Item): FeedItem => ({
    id: item.guid || item.link,
    url: item.link,
    title: item.title,
    published: item.pubdate?.toDateString() || undefined,
    lastModified: item.date?.toDateString() || undefined,
});

const callFeedParser = async (input: FeedParserInput): Promise<Feed> => {
    const parser = new FeedParser({});
    const parsedFeed: Feed = {
        id: input.feedUrl,
        url: input.feedUrl,
        items: [],
    };

    return new Promise((resolve, reject) => {
        const parsedItems: Array<FeedItem> = [];

        parser.on('meta', () => {
            parsedFeed.title = parser.meta.title || '';
            parsedFeed.link = parser.meta.link || '';
        });

        parser.on('readable', () => {
            let item: Item;

            while ((item = parser.read())) {
                parsedItems.push(mapFeedItem(item));
            }
        });

        parser.on('error', (e: Error) => {
            reject(e);
        });

        parser.write(input.feedData);

        parser.end(() => {
            resolve({
                ...parsedFeed,
                items: [...parsedItems],
            });
        });
    });
};
