import { fetchYoutubeDurationSeconds } from './fetchVideoDuration';

// fixtures mirror the structure of real watch pages fetched with a mobile user agent

const watchPageHtml = `
<!DOCTYPE html>
<html>
<head>
<script>var ytcfg = {dtsg: "AC8F_Q_bLaCg"};</script>
</head>
<body>
<script>
var ytInitialPlayerResponse = {"playabilityStatus":{"status":"OK","reason":null},"videoDetails":{"videoId":"OU6HZ-PTOPI","title":"Nobelpreis - mehr als eine Auszeichnung #tagesschau #nachrichten #pillay","lengthSeconds":"31","keywords":["tagesschau"],"channelId":"UC5NOEUbkLheQcaaRldYW5GA","viewCount":"5104","author":"tagesschau","isPrivate":false,"isLiveContent":false};
</script>
<script>var ytInitialData = {"contents":{"twoColumnWatchNextResults":{"results":{}}}}</script>
</body>
</html>
`;

const errorPageHtml = `
<script>
var ytInitialPlayerResponse = {"playabilityStatus":{"status":"ERROR","reason":"Video unavailable"}};
</script>
`;

const wrongVideoPageHtml = `
<script>
var ytInitialPlayerResponse = {"playabilityStatus":{"status":"OK"},"videoDetails":{"videoId":"SOMEOTHERVideo","lengthSeconds":"125"}};
</script>
`;

const loginRequiredPageHtml = `
<script>
var ytInitialPlayerResponse = {"playabilityStatus":{"status":"LOGIN_REQUIRED","reason":"Sign in to confirm your age"}};
</script>
`;

const facadeHtml = '<html><body>no player response here</body></html>';

const fakeFetch = (body: string, ok = true): typeof fetch =>
    (async () => ({ ok, async text() { return body; } })) as unknown as typeof fetch;

describe('#fetchYoutubeDurationSeconds', () => {
    it('extracts the duration from the watch page', async () => {
        await expect(fetchYoutubeDurationSeconds('OU6HZ-PTOPI', fakeFetch(watchPageHtml))).resolves.toBe(31);
    });

    it('returns undefined when the video is unavailable', async () => {
        await expect(fetchYoutubeDurationSeconds('OU6HZ-PTOPI', fakeFetch(errorPageHtml))).resolves.toBeUndefined();
        await expect(fetchYoutubeDurationSeconds('OU6HZ-PTOPI', fakeFetch(loginRequiredPageHtml))).resolves.toBeUndefined();
    });

    it('returns undefined when the page shows a different video', async () => {
        await expect(fetchYoutubeDurationSeconds('OU6HZ-PTOPI', fakeFetch(wrongVideoPageHtml))).resolves.toBeUndefined();
    });

    it('returns undefined when the player response is missing', async () => {
        await expect(fetchYoutubeDurationSeconds('OU6HZ-PTOPI', fakeFetch(facadeHtml))).resolves.toBeUndefined();
    });

    it('returns undefined on a non-ok response', async () => {
        await expect(fetchYoutubeDurationSeconds('OU6HZ-PTOPI', fakeFetch(facadeHtml, false))).resolves.toBeUndefined();
    });

    it('returns undefined when the request fails', async () => {
        const failingFetch = (async () => {
            throw new Error('network down');
        }) as unknown as typeof fetch;

        await expect(fetchYoutubeDurationSeconds('OU6HZ-PTOPI', failingFetch)).resolves.toBeUndefined();
    });
});