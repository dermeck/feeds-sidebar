import { githubDetector } from '../sites/github';
import { gitlabDetector } from '../sites/gitlab';
import { hackerNewsDetector } from '../sites/hackernews';
import { redditDetector } from '../sites/reddit';
import { stackExchangeDetector } from '../sites/stackexchange';
import { youtubeDetector } from '../sites/youtube';

const hrefs = (feeds: ReadonlyArray<{ href: string }>) => feeds.map((x) => x.href);

describe('reddit detector', () => {
    it('detects the subreddit feed', () => {
        expect(hrefs(redditDetector.detect(new URL('https://www.reddit.com/r/rss/')))).toEqual([
            'https://www.reddit.com/r/rss/.rss',
        ]);
    });

    it('detects the sorted subreddit feed', () => {
        expect(hrefs(redditDetector.detect(new URL('https://www.reddit.com/r/rss/new/')))).toEqual([
            'https://www.reddit.com/r/rss/new/.rss',
        ]);
    });

    it('detects the feed of a single post', () => {
        expect(
            hrefs(redditDetector.detect(new URL('https://www.reddit.com/r/rss/comments/abc123/some_title/'))),
        ).toEqual(['https://www.reddit.com/r/rss/comments/abc123/.rss']);
    });

    it('detects the user feed', () => {
        expect(hrefs(redditDetector.detect(new URL('https://www.reddit.com/user/someUser/')))).toEqual([
            'https://www.reddit.com/user/someUser/.rss',
        ]);
    });

    it('detects the multireddit feed', () => {
        expect(hrefs(redditDetector.detect(new URL('https://www.reddit.com/user/someUser/m/someMulti/')))).toEqual([
            'https://www.reddit.com/user/someUser/m/someMulti/.rss',
        ]);
    });

    it('keeps the origin of the current page', () => {
        expect(hrefs(redditDetector.detect(new URL('https://old.reddit.com/r/rss/')))).toEqual([
            'https://old.reddit.com/r/rss/.rss',
        ]);
    });

    it('detects the frontpage feed', () => {
        expect(hrefs(redditDetector.detect(new URL('https://www.reddit.com/')))).toEqual([
            'https://www.reddit.com/.rss',
        ]);
    });

    it('detects no feed for unrelated pages', () => {
        expect(redditDetector.detect(new URL('https://www.reddit.com/settings/profile'))).toEqual([]);
    });
});

describe('github detector', () => {
    it('detects the activity feed of a user', () => {
        expect(hrefs(githubDetector.detect(new URL('https://github.com/dermeck')))).toEqual([
            'https://github.com/dermeck.atom',
        ]);
    });

    it('detects releases, tags and commits of a repository', () => {
        expect(hrefs(githubDetector.detect(new URL('https://github.com/dermeck/feeds-sidebar')))).toEqual([
            'https://github.com/dermeck/feeds-sidebar/releases.atom',
            'https://github.com/dermeck/feeds-sidebar/tags.atom',
            'https://github.com/dermeck/feeds-sidebar/commits.atom',
        ]);
    });

    it('detects the commits feed of the current branch', () => {
        expect(
            hrefs(githubDetector.detect(new URL('https://github.com/dermeck/feeds-sidebar/commits/master'))),
        ).toEqual(['https://github.com/dermeck/feeds-sidebar/commits/master.atom']);
    });

    it('detects the releases feed on the releases page', () => {
        expect(hrefs(githubDetector.detect(new URL('https://github.com/dermeck/feeds-sidebar/releases')))).toEqual([
            'https://github.com/dermeck/feeds-sidebar/releases.atom',
        ]);
    });

    it('detects no feed for reserved paths', () => {
        expect(githubDetector.detect(new URL('https://github.com/settings/profile'))).toEqual([]);
        expect(githubDetector.detect(new URL('https://github.com/'))).toEqual([]);
    });
});

describe('gitlab detector', () => {
    it('detects the activity feed of a user', () => {
        expect(hrefs(gitlabDetector.detect(new URL('https://gitlab.com/someUser')))).toEqual([
            'https://gitlab.com/someUser.atom',
        ]);
    });

    it('detects activity and tags of a project', () => {
        expect(hrefs(gitlabDetector.detect(new URL('https://gitlab.com/someGroup/someProject')))).toEqual([
            'https://gitlab.com/someGroup/someProject.atom',
            'https://gitlab.com/someGroup/someProject/-/tags?format=atom',
        ]);
    });

    it('ignores the page within a project', () => {
        expect(
            hrefs(gitlabDetector.detect(new URL('https://gitlab.com/someGroup/someProject/-/merge_requests/42'))),
        ).toEqual([
            'https://gitlab.com/someGroup/someProject.atom',
            'https://gitlab.com/someGroup/someProject/-/tags?format=atom',
        ]);
    });

    it('detects no feed for reserved paths', () => {
        expect(gitlabDetector.detect(new URL('https://gitlab.com/explore/projects'))).toEqual([]);
    });
});

describe('hacker news detector', () => {
    it('detects the frontpage feed', () => {
        expect(hrefs(hackerNewsDetector.detect(new URL('https://news.ycombinator.com/')))).toEqual([
            'https://news.ycombinator.com/rss',
        ]);
    });

    it('detects submissions and comments of a user', () => {
        expect(hrefs(hackerNewsDetector.detect(new URL('https://news.ycombinator.com/user?id=someUser')))).toEqual([
            'https://hnrss.org/submitted?id=someUser',
            'https://hnrss.org/threads?id=someUser',
        ]);
    });

    it('detects the comments feed of an item', () => {
        expect(hrefs(hackerNewsDetector.detect(new URL('https://news.ycombinator.com/item?id=123')))).toEqual([
            'https://hnrss.org/item?id=123&comments=true',
        ]);
    });
});

describe('stack exchange detector', () => {
    it('detects the feed of a tag', () => {
        expect(
            hrefs(stackExchangeDetector.detect(new URL('https://stackoverflow.com/questions/tagged/typescript+react'))),
        ).toEqual(['https://stackoverflow.com/feeds/tag/typescript+react']);
    });

    it('detects the feed of a question', () => {
        expect(
            hrefs(stackExchangeDetector.detect(new URL('https://stackoverflow.com/questions/123456/some-question'))),
        ).toEqual(['https://stackoverflow.com/feeds/question/123456']);
    });

    it('detects the feed of new questions', () => {
        expect(hrefs(stackExchangeDetector.detect(new URL('https://superuser.com/')))).toEqual([
            'https://superuser.com/feeds',
        ]);
    });
});

describe('youtube detector', () => {
    beforeEach(() => {
        document.head.innerHTML = '';
    });

    it('detects the playlist feed', () => {
        expect(hrefs(youtubeDetector.detect(new URL('https://www.youtube.com/playlist?list=PL123')))).toEqual([
            'https://www.youtube.com/feeds/videos.xml?playlist_id=PL123',
        ]);
    });

    it('detects the channel feed from the url', () => {
        expect(
            hrefs(youtubeDetector.detect(new URL('https://www.youtube.com/channel/UC1234567890123456789012'))),
        ).toEqual(['https://www.youtube.com/feeds/videos.xml?channel_id=UC1234567890123456789012']);
    });

    it('detects the channel feed from the document', () => {
        document.head.innerHTML = '<meta itemprop="identifier" content="UC1234567890123456789012">';

        expect(hrefs(youtubeDetector.detect(new URL('https://www.youtube.com/watch?v=someVideo')))).toEqual([
            'https://www.youtube.com/feeds/videos.xml?channel_id=UC1234567890123456789012',
        ]);
    });

    it('detects playlist and channel feed on a video within a playlist', () => {
        document.head.innerHTML = '<meta itemprop="identifier" content="UC1234567890123456789012">';

        expect(hrefs(youtubeDetector.detect(new URL('https://www.youtube.com/watch?v=someVideo&list=PL123')))).toEqual([
            'https://www.youtube.com/feeds/videos.xml?playlist_id=PL123',
            'https://www.youtube.com/feeds/videos.xml?channel_id=UC1234567890123456789012',
        ]);
    });

    it('ignores identifiers that are no channel id', () => {
        document.head.innerHTML = '<meta itemprop="identifier" content="someVideoId">';

        expect(youtubeDetector.detect(new URL('https://www.youtube.com/watch?v=someVideo'))).toEqual([]);
    });
});
