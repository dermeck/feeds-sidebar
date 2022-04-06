import { Feed } from '../../../model/feeds';

export interface FetchFeedAction {
    type: 'worker/fetchFeed';
    url: string;
}

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

export type WorkerRequestAction = FetchFeedAction;
export type WorkerResponseAction = ParseFeedResultSuccess | ParseFeedResultError | FetchFeedResultError;
