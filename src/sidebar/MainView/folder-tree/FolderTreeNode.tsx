import React, { Fragment, memo, useMemo } from 'react';

import { useAppSelector } from '../../../store/hooks';
import { makeSelectTreeNode } from '../../../store/slices/feeds';
import Folder from './Folder/Folder';
import FolderSubTreeNode from './FolderSubTreeNode';

interface Props {
    nodeId: string;
    showTitle: boolean;
    nestedLevel: number;
    filterString: string;
}

const FolderTreeNode = ({ nodeId, showTitle, nestedLevel, filterString }: Props) => {
    const selectTreeNode = useMemo(makeSelectTreeNode, []);
    const node = useAppSelector((state) => selectTreeNode(state.feeds, nodeId));

    if (!node) {
        return <Fragment />;
    }

    return (
        <Folder node={node} nestedLevel={nestedLevel} showTitle={showTitle}>
            <FolderSubTreeNode
                node={node}
                showTitle={showTitle}
                nestedLevel={nestedLevel}
                filterString={filterString}
            />
        </Folder>
    );
};

const MemoizedFolderTreeNode = memo(FolderTreeNode);

if (process.env.MODE === 'dev') {
    FolderTreeNode.whyDidYouRender = true;
}

export default MemoizedFolderTreeNode;
