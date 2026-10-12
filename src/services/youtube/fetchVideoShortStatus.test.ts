import { fetchYoutubeShortStatus, isShortFromResponseUrl } from './fetchVideoShortStatus';

const fakeFetch = (url: string): typeof fetch =>
    (async () => ({
        ok: true,
        url,
    })) as unknown as typeof fetch;

describe('#isShortFromResponseUrl', () => {
    it('treats a final shorts url as a short', () => {
        expect(isShortFromResponseUrl('https://www.youtube.com/shorts/OU6HZ-PTOPI')).toBe(true);
    });

    it('treats a final watch url as a normal video', () => {
        expect(isShortFromResponseUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(false);
    });

    it('returns undefined for a non-youtube interstitial such as the consent page', () => {
        expect(
            isShortFromResponseUrl(
                'https://consent.youtube.com/m?continue=https%3A%2F%2Fwww.youtube.com%2Fshorts%2FOU6HZ-PTOPI',
            ),
        ).toBeUndefined();
    });

    it('returns undefined for an unparseable url', () => {
        expect(isShortFromResponseUrl('')).toBeUndefined();
    });
});

describe('#fetchYoutubeShortStatus', () => {
    it('reports a short when the request settles on a shorts url', async () => {
        await expect(
            fetchYoutubeShortStatus('OU6HZ-PTOPI', fakeFetch('https://www.youtube.com/shorts/OU6HZ-PTOPI')),
        ).resolves.toBe(true);
    });

    it('reports a normal video when the request redirects to a watch url', async () => {
        await expect(
            fetchYoutubeShortStatus('dQw4w9WgXcQ', fakeFetch('https://www.youtube.com/watch?v=dQw4w9WgXcQ')),
        ).resolves.toBe(false);
    });

    it('returns undefined when the response cannot be classified', async () => {
        await expect(
            fetchYoutubeShortStatus('OU6HZ-PTOPI', fakeFetch('https://consent.youtube.com/m?continue=x')),
        ).resolves.toBeUndefined();
    });

    it('returns undefined when the request fails', async () => {
        const failingFetch = (async () => {
            throw new Error('network down');
        }) as unknown as typeof fetch;

        await expect(fetchYoutubeShortStatus('OU6HZ-PTOPI', failingFetch)).resolves.toBeUndefined();
    });
});
