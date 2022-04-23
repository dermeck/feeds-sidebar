export interface Folder {
    id: string;
    title: string;
    feedIds: ReadonlyArray<string>;
    subfolders: ReadonlyArray<string>; // TODO should be subfolderIds
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

export interface NodeMeta {
    nodeId: string;
    nodeType: NodeType;
}

export interface FeedNode {
    nodeType: NodeType.Feed;
    data: Feed;
}

export interface FolderNode {
    nodeType: NodeType.Folder;
    data: Folder;
}

export type TreeNode = FolderNode | FeedNode;

export interface FeedItem {
    id: string;
    title: string;
    url: string;
    published?: string;
    lastModified?: string;
    isRead?: boolean;
}
