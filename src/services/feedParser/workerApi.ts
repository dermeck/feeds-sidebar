import { Feed } from '../../store/slices/feeds';

interface FetchFeedResultError {
    type: 'fetchError';
    url: string;
}

interface ParseFeedResultError {
    type: 'parseError';
    url: string;
}

interface ParseFeedResultSuccess {
    type: 'success';
    parsedFeed: Feed;
}

export type WorkerResponse = ParseFeedResultSuccess | ParseFeedResultError | FetchFeedResultError;
