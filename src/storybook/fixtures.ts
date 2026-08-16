import { Feed, Folder, rootFolderId } from '../model/feeds';
import { RootState } from '../store/store';
import { initialState as initialOptionsState } from '../store/slices/options';
import { initialState as initialSessionState } from '../store/slices/session';

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const mozillaFeedUrl = 'https://blog.mozilla.org/en/feed/';
export const tagesschauFeedUrl = 'https://www.tagesschau.de/xml/rss2/';
export const stackOverflowFeedUrl = 'https://stackoverflow.blog/feed/';
export const brokenFeedUrl = 'https://example.com/does-not-exist/feed.xml';

export const newsFolderId = '_news_';
export const techFolderId = '_tech_';

export const mozillaFeed: Feed = {
    id: mozillaFeedUrl,
    title: 'The Mozilla Blog',
    link: 'https://blog.mozilla.org/en/',
    lastFetched: daysAgo(0),
    items: [
        {
            id: `${mozillaFeedUrl}#1`,
            title: 'Firefox is getting faster',
            url: 'https://blog.mozilla.org/en/firefox-is-getting-faster/',
            published: daysAgo(0),
            isRead: false,
        },
        {
            id: `${mozillaFeedUrl}#2`,
            title: 'A new way to manage your feeds',
            url: 'https://blog.mozilla.org/en/a-new-way-to-manage-your-feeds/',
            published: daysAgo(1),
            isRead: false,
        },
        {
            id: `${mozillaFeedUrl}#3`,
            title: 'This item was already read',
            url: 'https://blog.mozilla.org/en/already-read/',
            published: daysAgo(2),
            isRead: true,
        },
    ],
};

export const tagesschauFeed: Feed = {
    id: tagesschauFeedUrl,
    title: 'tagesschau.de',
    link: 'https://www.tagesschau.de/',
    lastFetched: daysAgo(0),
    items: [
        {
            id: `${tagesschauFeedUrl}#1`,
            title: 'Ein sehr langer Nachrichtentitel, der nicht in die Sidebar passt und abgeschnitten wird',
            url: 'https://www.tagesschau.de/inland/langer-titel.html',
            published: daysAgo(0),
            isRead: false,
        },
        {
            id: `${tagesschauFeedUrl}#2`,
            title: 'Nachrichten von letzter Woche',
            url: 'https://www.tagesschau.de/inland/letzte-woche.html',
            published: daysAgo(5),
            isRead: false,
        },
    ],
};

export const stackOverflowFeed: Feed = {
    id: stackOverflowFeedUrl,
    title: 'Stack Overflow Blog',
    link: 'https://stackoverflow.blog/',
    lastFetched: daysAgo(3),
    items: [
        {
            id: `${stackOverflowFeedUrl}#1`,
            title: 'How we built our new search',
            url: 'https://stackoverflow.blog/how-we-built-our-new-search/',
            published: daysAgo(40),
            isRead: false,
        },
        {
            id: `${stackOverflowFeedUrl}#2`,
            title: 'An item without a publish date',
            url: 'https://stackoverflow.blog/no-date/',
            isRead: false,
        },
    ],
};

export const emptyFeed: Feed = {
    id: brokenFeedUrl,
    title: undefined,
    lastFetched: daysAgo(120),
    items: [],
};

export const feedsFixture: ReadonlyArray<Feed> = [mozillaFeed, tagesschauFeed, stackOverflowFeed, emptyFeed];

export const foldersFixture: ReadonlyArray<Folder> = [
    {
        id: rootFolderId,
        title: 'root',
        feedIds: [mozillaFeedUrl],
        subfolderIds: [newsFolderId, techFolderId],
    },
    {
        id: newsFolderId,
        title: 'News',
        feedIds: [tagesschauFeedUrl],
        subfolderIds: [],
    },
    {
        id: techFolderId,
        title: 'Tech',
        feedIds: [stackOverflowFeedUrl, brokenFeedUrl],
        subfolderIds: [],
    },
];

export const feedStatusFixture = [
    { url: mozillaFeedUrl, status: 'loaded' },
    { url: tagesschauFeedUrl, status: 'loaded' },
    { url: stackOverflowFeedUrl, status: 'loaded' },
    { url: brokenFeedUrl, status: 'error' },
] as const;

export const sessionFixture = {
    ...initialSessionState,
    feedStatus: feedStatusFixture,
};

export const stateFixture: Partial<RootState> = {
    feeds: {
        feeds: feedsFixture,
        folders: foldersFixture,
        selectedNode: undefined,
    },
    options: initialOptionsState,
    session: sessionFixture,
};

export const emptyStateFixture: Partial<RootState> = {
    feeds: {
        feeds: [],
        folders: [{ id: rootFolderId, title: 'root', feedIds: [], subfolderIds: [] }],
        selectedNode: undefined,
    },
    options: initialOptionsState,
    session: initialSessionState,
};
