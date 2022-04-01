import FeedParser, { Item } from 'feedparser';

import { Feed, FeedItem } from '../../store/slices/feeds';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import { fetchFeed } from './fetchFeed';
import { WorkerResponse } from './workerApi';

interface FeedParserInput {
    feedUrl: string;
    feedData: string;
}

self.onmessage = async (e: MessageEvent<string>) => {
    const feedUrl = e.data;

    const fetchResult = await fetchFeed(feedUrl);

    switch (fetchResult.type) {
        case 'success': {
            try {
                const parsedFeed = await callFeedParser({ feedUrl: fetchResult.url, feedData: fetchResult.response });
                const message: WorkerResponse = {
                    type: 'success',
                    parsedFeed,
                };
                self.postMessage(message);
            } catch (e) {
                // response is not a feed
                const message: WorkerResponse = { type: 'parseError', url: fetchResult.url };
                self.postMessage(message);
            }
            break;
        }

        case 'error': {
            const message: WorkerResponse = {
                type: 'fetchError',
                url: fetchResult.url,
            };
            self.postMessage(message);
            break;
        }

        default:
            throw new UnreachableCaseError(fetchResult);
    }
};

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
