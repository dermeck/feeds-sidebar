import React, { Fragment } from 'react';

import { NodeType, TreeNode } from '../../model/feeds';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import FeedItemList from './FeedItemList';
import FolderTreeNode from './FolderTreeNode';
import useDragDropNode from './dragdrop/useDragDropNode';

interface Props {
    node: TreeNode;
    selectedId?: string;
    showTitle: boolean;
    nestedLevel: number;
    filterString: string;
}

const FolderSubTreeNode = (props: Props): JSX.Element => {
    const { node, filterString, showTitle, selectedId, nestedLevel } = props;
    const { isDropNotAllowed } = useDragDropNode({ nodeId: node.data.id, nodeType: node.nodeType });

    switch (node.nodeType) {
        case NodeType.Feed:
            return (
                <Fragment>
                    {node.nodeType === NodeType.Feed && (
                        <FeedItemList
                            key={node.data.id}
                            feed={node.data}
                            filterString={filterString}
                            indented={showTitle}
                            nestedLevel={nestedLevel + 1}
                            selectedId={selectedId}
                            disabled={isDropNotAllowed}
                        />
                    )}
                </Fragment>
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
                                showTitle={showTitle}
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
