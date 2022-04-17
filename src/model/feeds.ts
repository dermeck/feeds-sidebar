export interface Folder {
    parentId: string | undefined;
    id: string;
    title: string;
    feedIds: ReadonlyArray<string>;
}

export interface Feed {
    id: string;
    url: string;
    items: ReadonlyArray<FeedItem>;
    link?: string;
    title?: string;
}

export const enum NodeType {
    Feed = 'FEED',
    Folder = 'FOLDER',
}

export interface FeedNode {
    nodeType: NodeType.Feed;
    feed: Feed;
}

export interface FolderNode {
    nodeType: NodeType.Folder;
    folder: Folder;
}

export type TopLevelTreeNode = FolderNode | FeedNode;

export interface FeedItem {
    id: string;
    title: string;
    url: string;
    published?: string;
    lastModified?: string;
    isRead?: boolean;
}
