import { youtubeVideoIdFromItemId, youtubeVideoIdFromUrl } from './videoUrl';

describe('#youtubeVideoIdFromUrl', () => {
    it('extracts the id from watch URLs', () => {
        expect(youtubeVideoIdFromUrl('https://www.youtube.com/watch?v=OU6HZ-PTOPI')).toBe('OU6HZ-PTOPI');
        expect(youtubeVideoIdFromUrl('https://m.youtube.com/watch?v=OU6HZ-PTOPI')).toBe('OU6HZ-PTOPI');
        expect(youtubeVideoIdFromUrl('https://youtube.com/watch?v=OU6HZ-PTOPI')).toBe('OU6HZ-PTOPI');
        expect(youtubeVideoIdFromUrl('https://www.youtube.com/watch?v=OU6HZ-PTOPI&list=PL123')).toBe('OU6HZ-PTOPI');
    });

    it('extracts the id from shorts, live and embed URLs', () => {
        expect(youtubeVideoIdFromUrl('https://www.youtube.com/shorts/OU6HZ-PTOPI')).toBe('OU6HZ-PTOPI');
        expect(youtubeVideoIdFromUrl('https://www.youtube.com/live/OU6HZ-PTOPI?t=5')).toBe('OU6HZ-PTOPI');
        expect(youtubeVideoIdFromUrl('https://www.youtube.com/embed/OU6HZ-PTOPI')).toBe('OU6HZ-PTOPI');
    });

    it('extracts the id from youtu.be links', () => {
        expect(youtubeVideoIdFromUrl('https://youtu.be/OU6HZ-PTOPI')).toBe('OU6HZ-PTOPI');
    });

    it('accepts protocol-relative and scheme-less urls', () => {
        expect(youtubeVideoIdFromUrl('//www.youtube.com/watch?v=OU6HZ-PTOPI')).toBe('OU6HZ-PTOPI');
        expect(youtubeVideoIdFromUrl('www.youtube.com/watch?v=OU6HZ-PTOPI')).toBe('OU6HZ-PTOPI');
    });

    it('returns undefined for non-video urls', () => {
        expect(youtubeVideoIdFromUrl('https://www.youtube.com/channel/UC5NOEUbkLheQcaaRldYW5GA')).toBeUndefined();
        expect(youtubeVideoIdFromUrl('https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA')).toBeUndefined();
        expect(youtubeVideoIdFromUrl('https://example.com/watch?v=OU6HZ-PTOPI')).toBeUndefined();
        expect(youtubeVideoIdFromUrl('https://www.youtube.com/watch')).toBeUndefined();
        expect(youtubeVideoIdFromUrl('https://youtu.be/')).toBeUndefined();
    });

    it('returns undefined for malformed ids', () => {
        expect(youtubeVideoIdFromUrl('https://www.youtube.com/watch?v=abc')).toBeUndefined();
        expect(youtubeVideoIdFromUrl('https://www.youtube.com/watch?v=OU6HZ-PTOPItoolongid12')).toBeUndefined();
        expect(youtubeVideoIdFromUrl('not a url')).toBeUndefined();
    });
});

describe('#youtubeVideoIdFromItemId', () => {
    it('extracts the id from yt:video guids', () => {
        expect(youtubeVideoIdFromItemId('yt:video:OU6HZ-PTOPI')).toBe('OU6HZ-PTOPI');
    });

    it('returns undefined for anything else', () => {
        expect(youtubeVideoIdFromItemId('yt:channel:UC5NOEUbkLheQcaaRldYW5GA')).toBeUndefined();
        expect(youtubeVideoIdFromItemId('yt:video:abc')).toBeUndefined();
        expect(youtubeVideoIdFromItemId('')).toBeUndefined();
    });
});