import { Feed, FeedItem, Folder } from '../../../model/feeds';

export const feed1Fixture: Feed = {
    id: 'feedId1',
    url: 'http://feedId1.url',
    items: [
        {
            id: 'itemId1',
            url: 'http://feedId1.url/item1',
            title: 'item1',
            isRead: false,
        },
        {
            id: 'itemId2',
            url: 'http://feedId1.url/item2',
            title: 'item2',
            isRead: false,
        },
    ],
};

export const feed2Fixture: Feed = {
    id: 'feedId2',
    url: 'http://feedId2.url',
    items: [
        {
            id: 'itemId1',
            url: 'http://feedId2.url/item1',
            title: 'item1',
            isRead: false,
        },
        {
            id: 'itemId2',
            url: 'http://feedId2.url/item2',
            title: 'item2',
            isRead: false,
        },
    ],
};

export const feed3Fixture: Feed = {
    id: 'feedId3',
    url: 'http://feedId3.url',
    items: [
        {
            id: 'itemId1',
            url: 'http://feedId3.url/item1',
            title: 'item1',
            isRead: false,
        },
        {
            id: 'itemId2',
            url: 'http://feedId3.url/item2',
            title: 'item2',
            isRead: false,
        },
    ],
};

export const itemFixture: (id: string) => FeedItem = (id: string) => ({
    id: id,
    url: `http://feed.url/${id}`,
    title: `title-${id}`,
    isRead: false,
});

export const folderFixture: (id: string) => Folder = (id: string) => ({ id, title: id, feedIds: [], subfolders: [] });

export const folder1Fixture = folderFixture('folder1');
export const folder2Fixture = folderFixture('folder2');
export const folder3Fixture = folderFixture('folder3');
export const folder4Fixture = folderFixture('folder4');

export const feedsFixture = [feed1Fixture, feed2Fixture];
