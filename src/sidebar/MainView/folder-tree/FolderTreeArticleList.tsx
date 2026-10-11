import React, { useMemo } from 'react';

import { NodeType } from '../../../model/feeds';
import { useAppSelector } from '../../../store/hooks';
import { feedItemsByNode, selectFeeds, selectFolders } from '../../../store/slices/feeds';
import { useNodeSelection } from '../selection';
import { FeedItemList } from '../FeedList/FeedItemList';
import { FeedListItemModel } from '../FeedList/item/FeedListItem';

type FolderTreeArticleListProps = {
    filterString: string;
    disabled: boolean;
};

export const FolderTreeArticleList = ({ filterString, disabled }: FolderTreeArticleListProps) => {
    const { selectedNode } = useNodeSelection();
    const feeds = useAppSelector((state) => selectFeeds(state.feeds));
    const folders = useAppSelector((state) => selectFolders(state.feeds));
    const items = useMemo(() => feedItemsByNode(feeds, folders, selectedNode), [feeds, folders, selectedNode]);

    if (selectedNode === undefined) {
        return null;
    }

    // only a folder aggregates several feeds, so only then does the parent title disambiguate
    const getItemLabel =
        selectedNode.nodeType === NodeType.Folder
            ? (item: FeedListItemModel) => (item.parentTitle ? `${item.parentTitle} | ${item.title}` : item.title)
            : undefined;

    return <FeedItemList items={items} filterString={filterString} disabled={disabled} getItemLabel={getItemLabel} />;
};
