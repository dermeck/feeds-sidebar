import React, { Fragment } from 'react';

import { NodeType, TreeNode } from '../../../model/feeds';
import { UnreachableCaseError } from '../../../utils/UnreachableCaseError';
import { FeedItemList } from '../FeedList/FeedItemList';
import FolderTreeNode from './FolderTreeNode';
import useDragDropNode from './dragdrop/useDragDropNode';

interface Props {
    node: TreeNode;
    nestedLevel: number;
    filterString: string;
}

const FolderSubTreeNode = (props: Props): JSX.Element => {
    const { node, filterString, nestedLevel } = props;
    const { isDropNotAllowed } = useDragDropNode({ nodeId: node.data.id, nodeType: node.nodeType });

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
                    disabled={isDropNotAllowed}
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

export default FolderSubTreeNode;
