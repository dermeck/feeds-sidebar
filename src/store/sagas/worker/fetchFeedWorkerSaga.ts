import FeedParser, { Item } from 'feedparser';

import { call, put } from 'redux-saga/effects';

import { Feed, FeedItem } from '../../../model/feeds';
import { UnreachableCaseError } from '../../../utils/UnreachableCaseError';
import { fetchFeed, FetchFeedResult } from './fetchFeed';
import { FetchFeedAction, WorkerResponseAction } from './workerApi';

interface FeedParserInput {
    feedUrl: string;
    feedData: string;
}

function* fetchFeedWorkerSaga(action: FetchFeedAction) {
    const fetchResult: FetchFeedResult = yield call(fetchFeed, action.url);

    switch (fetchResult.type) {
        case 'success': {
            try {
                const parsedFeed: Feed = yield call(callFeedParser, {
                    feedUrl: fetchResult.url,
                    feedData: fetchResult.response,
                });
                yield put<WorkerResponseAction>({ type: 'success', parsedFeed });
            } catch (e) {
                // response is not a feed
                yield put<WorkerResponseAction>({ type: 'parseError', url: fetchResult.url });
            }
            break;
        }

        case 'error': {
            yield put<WorkerResponseAction>({ type: 'fetchError', url: fetchResult.url });
            break;
        }

        default:
            throw new UnreachableCaseError(fetchResult);
    }
}

const mapFeedItem = (item: Item): FeedItem => ({
    id: item.guid ?? item.link,
    url: item.link,
    title: item.title ?? item.description,
    published: item.pubdate?.toDateString() || undefined,
    lastModified: item.date?.toDateString() || undefined,
});

const callFeedParser = async (input: FeedParserInput): Promise<Feed> => {
    const parser = new FeedParser({});
    const parsedFeed: Feed = {
        id: input.feedUrl,
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

export default fetchFeedWorkerSaga;
