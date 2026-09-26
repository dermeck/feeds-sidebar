import { runSaga } from 'redux-saga';

import { FeedItem } from '../../../model/feeds';
import { fetchFeed } from './fetchFeed';
import fetchFeedWorkerSaga from './fetchFeedWorkerSaga';
import { WorkerResponseAction } from './workerApi';

jest.mock('./fetchFeed', () => ({ fetchFeed: jest.fn() }));

// two entries published on the same day, twelve hours apart
const atomFeed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>a feed</title>
    <entry>
        <id>morning</id>
        <title>morning post</title>
        <updated>2024-01-01T08:00:00Z</updated>
        <link href="https://example.com/morning" />
    </entry>
    <entry>
        <id>evening</id>
        <title>evening post</title>
        <updated>2024-01-01T20:00:00Z</updated>
        <link href="https://example.com/evening" />
    </entry>
</feed>`;

const parse = async (response: string): Promise<ReadonlyArray<FeedItem>> => {
    (fetchFeed as jest.Mock).mockResolvedValue({ type: 'success', url: 'https://example.com/feed', response });

    const dispatched: WorkerResponseAction[] = [];
    await runSaga({ dispatch: (action: WorkerResponseAction) => dispatched.push(action) }, fetchFeedWorkerSaga, {
        type: 'worker/fetchFeed',
        url: 'https://example.com/feed',
    }).toPromise();

    const result = dispatched[0];

    if (result?.type !== 'success') {
        throw new Error(`expected a parsed feed, got ${JSON.stringify(result)}`);
    }

    return result.parsedFeed.items;
};

describe('item dates', () => {
    beforeEach(() => {
        (fetchFeed as jest.Mock).mockReset();
    });

    it('keeps the time of day, so items of the same day can be ordered', async () => {
        const items = await parse(atomFeed);

        expect(items).toHaveLength(2);
        const times = items.map((item) => new Date(item.published ?? item.lastModified ?? '').getTime());

        expect(times.every((time) => !Number.isNaN(time))).toBe(true);
        expect(times[0]).not.toBe(times[1]);
    });
});
