import FeedParser, { Item } from 'feedparser';

import { Feed, FeedItem } from '../store/slices/feeds';

const parseFeed = async (input: { feedUrl: string; feedData: string }): Promise<Feed> => {
    const parser = new FeedParser({});
    const parsedFeed: Feed = {
        id: input.feedUrl,
        url: input.feedUrl,
        items: [],
    };

    const parsedItems: Array<FeedItem> = [];

    return new Promise((resolve, reject) => {
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

const mapFeedItem = (item: Item): FeedItem => ({
    id: item.guid || item.link,
    url: item.link,
    title: item.title,
    published: item.pubdate?.toDateString() || undefined,
    lastModified: item.date?.toDateString() || undefined,
});

export default parseFeed;
