import React, { Fragment, memo, useMemo } from 'react';

import { NodeType } from '../../model/feeds';
import { useAppSelector } from '../../store/hooks';
import { makeSelectTreeNode } from '../../store/slices/feeds';
import Folder from './Folder';
import FolderSubTreeNode from './FolderSubTreeNode';

interface Props {
    nodeId: string;
    showTitle: boolean;
    nestedLevel: number;
    filterString: string;
}

const FolderTreeNode = (props: Props) => {
    const selectTreeNode = useMemo(makeSelectTreeNode, []);
    const node = useAppSelector((state) => selectTreeNode(state.feeds, props.nodeId));

    if (!node) {
        return <Fragment />;
    }

    const { id, title } = node.data;

    return (
        <Folder
            nodeMeta={{ nodeId: id, nodeType: node.nodeType }}
            title={title ?? (node.nodeType === NodeType.Feed ? node.data.id : '')}
            nestedLevel={props.nestedLevel}
            showTitle={props.showTitle}>
            <FolderSubTreeNode node={node} {...props} />
        </Folder>
    );
};

const MemoizedFolderTreeNode = memo(FolderTreeNode);

if (process.env.MODE === 'dev') {
    FolderTreeNode.whyDidYouRender = true;
}

export default MemoizedFolderTreeNode;
