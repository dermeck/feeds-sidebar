const DESKTOP_USER_AGENT =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

// the /shorts/ endpoint is the authoritative classifier: it stays on /shorts/ for a short and
// redirects to /watch for a normal video, so the final response url tells the two apart
const SHORTS_URL = (videoId: string) => `https://www.youtube.com/shorts/${videoId}`;

export const isShortFromResponseUrl = (finalUrl: string): boolean | undefined => {
    try {
        const url = new URL(finalUrl);
        const host = url.hostname.replace(/^www\./, '');

        if (host !== 'youtube.com' && !host.endsWith('.youtube.com')) {
            // consent or other interstitial, no classification
            return undefined;
        }

        if (url.pathname.startsWith('/shorts/')) {
            return true;
        }

        return url.pathname === '/watch' ? false : undefined;
    } catch {
        return undefined;
    }
};

export const fetchYoutubeShortStatus = async (
    videoId: string,
    fetchImpl: typeof fetch = fetch,
): Promise<boolean | undefined> => {
    // AbortSignal.timeout is missing in some runtimes (e.g. the jsdom test environment)
    const timeoutSignal = typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(15_000) : undefined;

    const requestOptions: RequestInit = {
        // HEAD: no page body is needed, only where the request ends up
        method: 'HEAD',
        // cookies carry the consent state, without which the EU interstitial replaces the redirect
        credentials: 'include',
        headers: {
            'User-Agent': DESKTOP_USER_AGENT,
            'Accept-Language': 'en-US,en;q=0.9',
        },
        ...(timeoutSignal !== undefined ? { signal: timeoutSignal } : {}),
    };

    try {
        const response = await fetchImpl(SHORTS_URL(videoId), requestOptions);

        return isShortFromResponseUrl(response.url);
    } catch {
        return undefined;
    }
};
