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

    const Child = () => (
        <FolderSubTreeNode
            key={node.data.id}
            node={node}
            showTitle={props.showTitle}
            nestedLevel={props.nestedLevel}
            filterString={props.filterString}
        />
    );

    const MemoizedChild = memo(Child);

    return (
        <Folder
            nodeMeta={{ nodeId: id, nodeType: node.nodeType }}
            title={title ?? (node.nodeType === NodeType.Feed ? node.data.id : '')}
            nestedLevel={props.nestedLevel}
            showTitle={props.showTitle}>
            <MemoizedChild />
        </Folder>
    );
};

const MemoizedFolderTreeNode = memo(FolderTreeNode);

if (process.env.MODE === 'dev') {
    FolderTreeNode.whyDidYouRender = true;
}

export default MemoizedFolderTreeNode;
