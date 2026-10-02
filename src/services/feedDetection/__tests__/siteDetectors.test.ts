import { detectFeedsForSite } from '../feedDetection';

const hrefs = (input: string) => detectFeedsForSite(new URL(input)).map((x) => x.href);

describe('github', () => {
    it('offers the three repo feeds for a bare repo url', () => {
        expect(hrefs('https://github.com/foo/bar')).toEqual([
            'https://github.com/foo/bar/releases.atom',
            'https://github.com/foo/bar/tags.atom',
            'https://github.com/foo/bar/commits.atom',
        ]);
    });

    it('offers the activity feed for a user page', () => {
        expect(hrefs('https://github.com/someone')).toEqual(['https://github.com/someone.atom']);
    });

    it('offers only releases on the releases page', () => {
        expect(hrefs('https://github.com/foo/bar/releases')).toEqual(['https://github.com/foo/bar/releases.atom']);
    });

    it('offers only tags on the tags page', () => {
        expect(hrefs('https://github.com/foo/bar/tags')).toEqual(['https://github.com/foo/bar/tags.atom']);
    });

    it('keeps the branch on a branch specific commits page', () => {
        expect(hrefs('https://github.com/foo/bar/commits/main')).toEqual(['https://github.com/foo/bar/commits/main.atom']);
    });

    it('falls back to the three repo feeds on issues and tree pages', () => {
        expect(hrefs('https://github.com/foo/bar/issues')).toHaveLength(3);
        expect(hrefs('https://github.com/foo/bar/tree/main')).toHaveLength(3);
    });

    it('ignores reserved segments that only look like a user page', () => {
        expect(hrefs('https://github.com/settings')).toEqual([]);
        expect(hrefs('https://github.com/features')).toEqual([]);
        expect(hrefs('https://github.com/organizations')).toEqual([]);
    });

    it('offers nothing for an already resolved feed url', () => {
        expect(hrefs('https://github.com/foo/bar/commits.atom')).toEqual([]);
    });
});

describe('reddit', () => {
    it('offers the subreddit feed', () => {
        expect(hrefs('https://www.reddit.com/r/programming/')).toEqual(['https://www.reddit.com/r/programming/.rss']);
    });

    it('offers the sorted subreddit feed', () => {
        expect(hrefs('https://www.reddit.com/r/programming/top/')).toEqual([
            'https://www.reddit.com/r/programming/top/.rss',
        ]);
    });

    it('offers the comment feed of a single post', () => {
        expect(hrefs('https://www.reddit.com/r/programming/comments/abc123/some_title/')).toEqual([
            'https://www.reddit.com/r/programming/comments/abc123/.rss',
        ]);
    });

    it('offers the user feed', () => {
        expect(hrefs('https://www.reddit.com/user/someUser/')).toEqual(['https://www.reddit.com/user/someUser/.rss']);
    });

    it('offers the multireddit feed', () => {
        expect(hrefs('https://www.reddit.com/user/someUser/m/someMulti/')).toEqual([
            'https://www.reddit.com/user/someUser/m/someMulti/.rss',
        ]);
    });

    it('offers the frontpage feed', () => {
        expect(hrefs('https://www.reddit.com/')).toEqual(['https://www.reddit.com/.rss']);
    });

    it('preserves the query of a search feed', () => {
        expect(hrefs('https://www.reddit.com/search?q=rust')).toEqual(['https://www.reddit.com/search.rss?q=rust']);
    });

    it('keeps the origin of the current page', () => {
        expect(hrefs('https://old.reddit.com/r/rss/')).toEqual(['https://old.reddit.com/r/rss/.rss']);
    });

    it('ignores pages without a feed', () => {
        expect(hrefs('https://www.reddit.com/login')).toEqual([]);
        expect(hrefs('https://www.reddit.com/settings')).toEqual([]);
    });

    it('offers nothing for an already resolved feed url', () => {
        expect(hrefs('https://www.reddit.com/r/rss/.rss')).toEqual([]);
    });
});

describe('medium', () => {
    it('resolves an @handle to the same feed as a bare handle', () => {
        expect(hrefs('https://medium.com/@readwrite')).toEqual(['https://medium.com/feed/readwrite']);
        expect(hrefs('https://medium.com/readwrite')).toEqual(['https://medium.com/feed/readwrite']);
    });

    it('resolves a tag page', () => {
        expect(hrefs('https://medium.com/tag/design')).toEqual(['https://medium.com/feed/tag/design']);
    });

    it('resolves a tagged publication page', () => {
        expect(hrefs('https://medium.com/publication/tagged/design')).toEqual([
            'https://medium.com/feed/publication/tagged/design',
        ]);
    });

    it('resolves a custom domain publication to its root feed', () => {
        expect(hrefs('https://username.medium.com/')).toEqual(['https://username.medium.com/feed']);
    });

    it('offers nothing for an already resolved feed url', () => {
        expect(hrefs('https://medium.com/feed/readwrite')).toEqual([]);
    });
});

describe('substack', () => {
    it('discards the path so every page yields the same feed', () => {
        const expected = ['https://stratechery.substack.com/feed'];

        expect(hrefs('https://stratechery.substack.com/')).toEqual(expected);
        expect(hrefs('https://stratechery.substack.com/about')).toEqual(expected);
        expect(hrefs('https://stratechery.substack.com/archive')).toEqual(expected);
    });

    it('matches a www subdomain', () => {
        expect(hrefs('https://www.stratechery.substack.com/about')).toEqual(['https://www.stratechery.substack.com/feed']);
    });

    it('offers nothing for an already resolved feed url', () => {
        expect(hrefs('https://stratechery.substack.com/feed')).toEqual([]);
        expect(hrefs('https://stratechery.substack.com/feed.xml')).toEqual([]);
    });

    it('does not guess for a custom domain, which is indistinguishable from any other blog', () => {
        expect(hrefs('https://www.oneusefulthing.org/')).toEqual([]);
    });
});

describe('kickstarter', () => {
    it('offers the updates feed of a project', () => {
        expect(hrefs('https://www.kickstarter.com/projects/creator/some-slug')).toEqual([
            'https://www.kickstarter.com/projects/creator/some-slug/posts.atom',
        ]);
    });

    it('offers nothing for other kickstarter pages', () => {
        expect(hrefs('https://www.kickstarter.com/discover/advanced')).toEqual([]);
        expect(hrefs('https://www.kickstarter.com/')).toEqual([]);
    });

    it('does not offer an updates feed, which redirects to the html page', () => {
        expect(hrefs('https://www.kickstarter.com/projects/creator/some-slug/updates')).toEqual([]);
    });
});

describe('gitlab', () => {
    it('splits the project path at the dash separator', () => {
        expect(hrefs('https://gitlab.com/gitlab-org/gitlab/-/issues')).toContain(
            'https://gitlab.com/gitlab-org/gitlab.atom',
        );
    });

    it('offers the activity feed for a user page', () => {
        expect(hrefs('https://gitlab.com/someone')).toEqual(['https://gitlab.com/someone.atom']);
    });

    it('ignores reserved segments', () => {
        expect(hrefs('https://gitlab.com/admin')).toEqual([]);
        expect(hrefs('https://gitlab.com/groups')).toEqual([]);
    });
});

describe('hacker news', () => {
    it('offers the frontpage feed', () => {
        expect(hrefs('https://news.ycombinator.com/')).toEqual(['https://news.ycombinator.com/rss']);
    });

    it('offers nothing for the feed url itself', () => {
        expect(hrefs('https://news.ycombinator.com/rss')).toEqual([]);
    });
});

describe('stack exchange', () => {
    it('resolves a tagged questions page', () => {
        expect(hrefs('https://stackoverflow.com/questions/tagged/typescript')).toEqual([
            'https://stackoverflow.com/feeds/tag/typescript',
        ]);
    });

    it('keeps a multi tag query intact', () => {
        expect(hrefs('https://stackoverflow.com/questions/tagged/typescript+react')).toEqual([
            'https://stackoverflow.com/feeds/tag/typescript+react',
        ]);
    });

    it('offers the site feed for other pages', () => {
        expect(hrefs('https://stackoverflow.com/questions/113/why')).toEqual(['https://stackoverflow.com/feeds']);
    });
});

describe('youtube', () => {
    it('offers the playlist feed', () => {
        expect(hrefs('https://www.youtube.com/watch?v=abc&list=PL123')).toEqual([
            'https://www.youtube.com/feeds/videos.xml?playlist_id=PL123',
        ]);
    });

    it('offers the channel feed', () => {
        expect(hrefs('https://www.youtube.com/channel/UC5NOEUbkLheQcaaRldYW5GA')).toEqual([
            'https://www.youtube.com/feeds/videos.xml?channel_id=UC5NOEUbkLheQcaaRldYW5GA',
        ]);
    });

    it('offers nothing without a playlist or channel', () => {
        expect(hrefs('https://www.youtube.com/watch?v=abc')).toEqual([]);
    });
});