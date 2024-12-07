import React, { Fragment, memo, useMemo } from 'react';

import { useAppSelector } from '../../../store/hooks';
import { makeSelectTreeNode } from '../../../store/slices/feeds';
import { Folder } from './Folder/Folder';
import { FolderSubTreeNode } from './FolderSubTreeNode';

type FolderTreeNode = {
    nodeId: string;
    nestedLevel: number;
    filterString: string;
};

const FolderTreeNode = ({ nodeId, nestedLevel, filterString }: FolderTreeNode) => {
    const selectTreeNode = useMemo(() => makeSelectTreeNode(), []);
    const node = useAppSelector((state) => selectTreeNode(state.feeds, nodeId));

    if (!node) {
        return <Fragment />;
    }

    return (
        <Folder node={node} nestedLevel={nestedLevel}>
            <FolderSubTreeNode node={node} nestedLevel={nestedLevel} filterString={filterString} />
        </Folder>
    );
};

const MemoizedFolderTreeNode = memo(FolderTreeNode);

if (process.env.MODE === 'dev') {
    FolderTreeNode.whyDidYouRender = true;
}

export { MemoizedFolderTreeNode as FolderTreeNode };
