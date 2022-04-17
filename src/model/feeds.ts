export interface Folder {
    //parentId: string | undefined; // TODO is this needed?
    id: string;
    title: string;
    feedIds: ReadonlyArray<string>;
    subFolders: ReadonlyArray<string>;
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
    data: Feed;
}

export interface FolderNode {
    nodeType: NodeType.Folder;
    data: Folder;
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
