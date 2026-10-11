import React from 'react';

import { useAppSelector } from '../../../store/hooks';
import { selectSelectedNodeFeedItems } from '../../../store/slices/feeds';
import { FeedItemList } from '../FeedList/FeedItemList';

type FolderTreeArticleListProps = {
    filterString: string;
    disabled: boolean;
};

export const FolderTreeArticleList = ({ filterString, disabled }: FolderTreeArticleListProps) => {
    const items = useAppSelector((state) => selectSelectedNodeFeedItems(state.feeds));

    return (
        <FeedItemList
            items={items}
            filterString={filterString}
            disabled={disabled}
            getItemLabel={(item) => (item.parentTitle ? `${item.parentTitle} | ${item.title}` : item.title)}
        />
    );
};
