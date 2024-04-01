import { Feed } from '../../../model/feeds';

export interface FetchFeedAction {
    type: 'worker/fetchFeed';
    url: string;
}

interface FetchFeedResultError {
    type: 'fetchError';
    url: string;
    errorMessage: string;
}

interface ParseFeedResultError {
    type: 'parseError';
    url: string;
    errorMessage: string;
}

interface ParseFeedResultSuccess {
    type: 'success';
    parsedFeed: Feed;
}

export type WorkerRequestAction = FetchFeedAction;
export type WorkerResponseAction = ParseFeedResultSuccess | ParseFeedResultError | FetchFeedResultError;
