import React from 'react';
import FolderTreeNode from './FolderTreeNode';
import { TreeNode } from '../../../model/feeds';

interface Props {
    filterString: string;
    nodes: ReadonlyArray<TreeNode>;
}

export const MainViewFolderTree = ({ nodes, filterString }: Props) => {
    return (
        <>
            {nodes.map((node) => (
                <FolderTreeNode
                    key={node.data.id}
                    nodeId={node.data.id}
                    nestedLevel={0}
                    showTitle={true} // TODO mr
                    filterString={filterString}
                />
            ))}
        </>
    );
};
