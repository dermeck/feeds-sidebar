import { fetchFeed, FetchFeedResult } from './fetchFeed';

describe('#fetchFeed', () => {
    it('calls fetch with the provided url', async () => {
        const fetchMock = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ test: 100 }),
            }),
        ) as jest.Mock;
        global.fetch = fetchMock;

        await fetchFeed('http://test.url');

        expect(fetchMock).toBeCalledTimes(1);
        expect(fetchMock).toBeCalledWith('http://test.url');
    });

    it('returns success response if fetch is successful', async () => {
        const fetchMock = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve('moep'),
            }),
        ) as jest.Mock;
        global.fetch = fetchMock;

        const expectation: FetchFeedResult = {
            type: 'success',
            url: 'http://test.url',
            response: 'moep',
        };

        const result = await fetchFeed('http://test.url');

        expect(result).toStrictEqual(expectation);
    });

    it('returns error response if fetch fails', async () => {
        const fetchMock = jest.fn(() => Promise.reject()) as jest.Mock;
        global.fetch = fetchMock;

        const expectation: FetchFeedResult = {
            type: 'error',
            url: 'http://test.url',
        };

        const result = await fetchFeed('http://test.url');

        expect(result).toStrictEqual(expectation);
    });
});
