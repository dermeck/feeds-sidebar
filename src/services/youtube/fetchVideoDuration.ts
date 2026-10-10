const MOBILE_USER_AGENT =
    'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';

// The mobile page is roughly half the size of the desktop one (~700 KB vs ~1.3 MB)
// and still embeds ytInitialPlayerResponse with the video duration.
const WATCH_PAGE_URL = (videoId: string) => `https://m.youtube.com/watch?v=${videoId}`;

const PLAYER_RESPONSE_MARKER = 'ytInitialPlayerResponse';
const LENGTH_LABEL = '"lengthSeconds":"';

const parseLengthSeconds = (html: string, videoId: string): number | undefined => {
    const playerStart = html.indexOf(PLAYER_RESPONSE_MARKER);

    if (playerStart === -1) {
        return undefined;
    }

    const searchFrom = playerStart + PLAYER_RESPONSE_MARKER.length;

    // guard against resolving the duration of a different video shown on the page
    if (html.indexOf(`"videoId":"${videoId}"`, searchFrom) === -1) {
        return undefined;
    }

    const labelStart = html.indexOf(LENGTH_LABEL, searchFrom);

    if (labelStart === -1) {
        return undefined;
    }

    let value = '';
    let index = labelStart + LENGTH_LABEL.length;

    while (index < html.length && html[index] >= '0' && html[index] <= '9') {
        value += html[index];
        index += 1;
    }

    const seconds = value === '' ? undefined : Number(value);

    return seconds === 0 ? undefined : seconds;
};

export const fetchYoutubeDurationSeconds = async (
    videoId: string,
    fetchImpl: typeof fetch = fetch,
): Promise<number | undefined> => {
    // AbortSignal.timeout is missing in some runtimes (e.g. the jsdom test environment)
    const timeoutSignal = typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(15_000) : undefined;

    const requestOptions = {
        headers: {
            'User-Agent': MOBILE_USER_AGENT,
            'Accept-Language': 'en-US,en;q=0.9',
        },
        ...(timeoutSignal !== undefined ? { signal: timeoutSignal } : {}),
    };

    try {
        const response = await fetchImpl(WATCH_PAGE_URL(videoId), requestOptions);

        if (!response.ok) {
            return undefined;
        }

        return parseLengthSeconds(await response.text(), videoId);
    } catch {
        return undefined;
    }
};
