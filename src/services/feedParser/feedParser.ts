import { Feed } from '../../store/slices/feeds';

export interface FeedParserInput {
    feedUrl: string;
    feedData: string;
}

interface ParseFeedResultSuccess {
    type: 'success';
    parsedFeed: Feed;
}

interface ParseFeedResultError {
    url: string;
    type: 'error';
}

export type ParseFeedResult = ParseFeedResultSuccess | ParseFeedResultError;

const parseFeed = async (input: FeedParserInput): Promise<ParseFeedResult> => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url));

    worker.postMessage(input);

    return new Promise((resolve, reject) => {
        worker.onmessage = (e: MessageEvent<ParseFeedResult>) => {
            const result = e.data;

            if (result.type === 'success') {
                resolve(result);
            }

            reject(result);
        };
    });
};

export default parseFeed;
