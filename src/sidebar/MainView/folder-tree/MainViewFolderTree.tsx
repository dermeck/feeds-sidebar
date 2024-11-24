import React from 'react';
import { FolderTreeNode } from './FolderTreeNode';
import { TreeNode } from '../../../model/feeds';

type MainViewFolderTreeProps = {
    className: string;
    filterString: string;
    nodes: ReadonlyArray<TreeNode>;
};

export const MainViewFolderTree = ({ className, nodes, filterString }: MainViewFolderTreeProps) => {
    return (
        <div className={className}>
            {nodes.map((node) => (
                <FolderTreeNode key={node.data.id} nodeId={node.data.id} nestedLevel={0} filterString={filterString} />
            ))}
        </div>
    );
};
