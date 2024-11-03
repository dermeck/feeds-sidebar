import React from 'react';
import FolderTreeNode from '../folder-tree/FolderTreeNode'; // TODO mr
import { TreeNode } from '../../../model/feeds';

interface Props {
    filterString: string;
    nodes: ReadonlyArray<TreeNode>;
}

export const MainViewPlainList = ({ nodes, filterString }: Props) => {
    // TODO mr just get all feeds and render the plain list
    return (
        <>
            {nodes.map((node) => (
                <FolderTreeNode
                    key={node.data.id}
                    nodeId={node.data.id}
                    nestedLevel={0}
                    showTitle={false} // TODO mr
                    filterString={filterString}
                />
            ))}
        </>
    );
};
