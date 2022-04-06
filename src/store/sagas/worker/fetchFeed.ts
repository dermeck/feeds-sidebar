interface FetchFeedResultSuccess {
    type: 'success';
    url: string;
    response: string;
}

interface FetchFeedResultError {
    type: 'error';
    url: string;
}

export type FetchFeedResult = FetchFeedResultSuccess | FetchFeedResultError;

export const fetchFeed = async (url: string): Promise<FetchFeedResult> => {
    try {
        const response = await fetch(url);
        const respString = await response.text();

        return {
            type: 'success',
            url,
            response: respString,
        };
    } catch (e) {
        console.error(e);
        return {
            type: 'error',
            url,
        };
    }
};
