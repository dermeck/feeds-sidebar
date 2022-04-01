export interface Feed {
    id: string;
    url: string;
    items: ReadonlyArray<FeedItem>;
    link?: string;
    title?: string;
}

export interface FeedItem {
    id: string;
    title: string;
    url: string;
    published?: string;
    lastModified?: string;
    isRead?: boolean;
}
