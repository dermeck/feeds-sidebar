import React from 'react';

import { NodeType } from '../../../model/feeds';
import { useAppSelector } from '../../../store/hooks';
import { selectSelectedNode, selectSelectedNodeFeedItems } from '../../../store/slices/feeds';
import { FeedItemList } from '../FeedList/FeedItemList';
import { FeedListItemModel } from '../FeedList/item/FeedListItem';

type FolderTreeArticleListProps = {
    filterString: string;
    disabled: boolean;
};

export const FolderTreeArticleList = ({ filterString, disabled }: FolderTreeArticleListProps) => {
    const selectedNode = useAppSelector((state) => selectSelectedNode(state.feeds));
    const items = useAppSelector((state) => selectSelectedNodeFeedItems(state.feeds));

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
