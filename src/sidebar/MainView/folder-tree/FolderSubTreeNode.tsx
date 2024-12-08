import React, { Fragment } from 'react';

import { NodeType, TreeNode } from '../../../model/feeds';
import { UnreachableCaseError } from '../../../utils/UnreachableCaseError';
import { FeedItemList } from '../FeedList/FeedItemList';
import { FolderTreeNode } from './FolderTreeNode';

type FolderSubTreeNodeProps = {
    node: TreeNode;
    nestedLevel: number;
    filterString: string;
};

export const FolderSubTreeNode = (props: FolderSubTreeNodeProps) => {
    const { node, filterString, nestedLevel } = props;

    switch (node.nodeType) {
        case NodeType.Feed:
            return (
                <FeedItemList
                    key={node.data.id}
                    items={node.data.items.map((item) => ({
                        ...item,
                        parentId: node.data.id,
                        parentTitle: node.data.title,
                    }))}
                    filterString={filterString}
                    nestedLevel={nestedLevel + 1}
                />
            );

        case NodeType.Folder: {
            const childIds = [...node.data.subfolderIds, ...node.data.feedIds];

            return (
                <Fragment>
                    {childIds.map((childId) => {
                        return (
                            <FolderTreeNode
                                key={childId}
                                nodeId={childId}
                                nestedLevel={nestedLevel + 1}
                                filterString={filterString}
                            />
                        );
                    })}
                </Fragment>
            );
        }

        default:
            throw new UnreachableCaseError(node);
    }
};
