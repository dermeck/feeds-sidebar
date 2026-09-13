import { detectFeeds } from '../feedDetection';

const setPage = (url: string, headHtml = '') => {
    Object.defineProperty(document, 'URL', { value: url, configurable: true });
    document.head.innerHTML = headHtml;
};

describe('detectFeeds', () => {
    it('detects feeds announced by link elements', () => {
        setPage(
            'https://example.com/blog',
            `<link rel="alternate" type="application/rss+xml" title="Example Blog" href="https://example.com/blog/rss">
             <link rel="alternate" type="application/atom+xml" href="https://example.com/blog/atom">`,
        );

        expect(detectFeeds()).toEqual([
            { type: 'application/rss+xml', href: 'https://example.com/blog/rss', title: 'Example Blog' },
            {
                type: 'application/atom+xml',
                href: 'https://example.com/blog/atom',
                title: 'https://example.com/blog/atom',
            },
        ]);
    });

    it('detects json feeds', () => {
        setPage(
            'https://example.com/blog',
            `<link rel="alternate" type="application/feed+json" href="https://example.com/feed.json">
             <link rel="alternate" type="application/json" href="https://example.com/other.json">`,
        );

        expect(detectFeeds().map((x) => x.href)).toEqual([
            'https://example.com/feed.json',
            'https://example.com/other.json',
        ]);
    });

    it('ignores link elements that are no feeds', () => {
        setPage(
            'https://example.com/blog',
            `<link rel="stylesheet" type="text/css" href="https://example.com/styles.css">
             <link rel="manifest" type="application/json" href="https://example.com/manifest.json">`,
        );

        expect(detectFeeds()).toEqual([]);
    });

    it('detects site specific feeds', () => {
        setPage('https://github.com/dermeck/feeds-sidebar/releases');

        expect(detectFeeds().map((x) => x.href)).toEqual(['https://github.com/dermeck/feeds-sidebar/releases.atom']);
    });

    it('does not apply site detectors of other sites', () => {
        setPage('https://example.com/r/rss');

        expect(detectFeeds()).toEqual([]);
    });

    it('applies site detectors to subdomains', () => {
        setPage('https://old.reddit.com/r/rss');

        expect(detectFeeds().map((x) => x.href)).toEqual(['https://old.reddit.com/r/rss/.rss']);
    });

    it('prefers announced feeds over detected feeds pointing to the same resource', () => {
        setPage(
            'https://www.youtube.com/channel/UC1234567890123456789012',
            `<link rel="alternate" type="application/rss+xml" title="Channel Feed"
                href="https://www.youtube.com/feeds/videos.xml?channel_id=UC1234567890123456789012">`,
        );

        expect(detectFeeds()).toEqual([
            {
                type: 'application/rss+xml',
                href: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC1234567890123456789012',
                title: 'Channel Feed',
            },
        ]);
    });
});
