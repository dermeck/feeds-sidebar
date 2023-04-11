import React, { Fragment, memo, useMemo } from 'react';

import { menuWidthInPx } from '../../base-components/styled/Menu';
import { NodeType } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { makeSelectTreeNode } from '../../store/slices/feeds';
import sessionSlice from '../../store/slices/session';
import useWindowDimensions from '../../utils/hooks/useWindowDimensions';
import Folder from './Folder';
import FolderSubTreeNode from './FolderSubTreeNode';

interface Props {
    nodeId: string;
    showTitle: boolean;
    nestedLevel: number;
    filterString: string;
}

// TODO find a more robust way to determine menu height
const contextMenuHeight = 64; // 2 menu items, each 32px

const FolderTreeNode = (props: Props) => {
    const selectTreeNode = useMemo(makeSelectTreeNode, []);
    const node = useAppSelector((state) => selectTreeNode(state.feeds, props.nodeId));
    const dispatch = useAppDispatch();

    const { height, width } = useWindowDimensions();

    if (!node) {
        return <Fragment />;
    }

    const { id, title } = node.data;

    // TODO auslagern nach ContextMenuTarget
    const handleContextMenuFolder = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();

        if (width === undefined || height === undefined) {
            console.error('Could not open context menu. Unable to determine dimensions of window.');
            return;
        }

        const x = width - e.clientX < menuWidthInPx ? width - menuWidthInPx : e.clientX;
        const y = height - e.clientY < contextMenuHeight ? height - contextMenuHeight : e.clientY;

        dispatch(sessionSlice.actions.showContextMenu({ x, y }));

        if (node !== undefined) {
            dispatch(feedsSlice.actions.select({ nodeType: node.nodeType, nodeId: id }));
        }
    };

    return (
        <Folder
            nodeMeta={{ nodeId: id, nodeType: node.nodeType }}
            title={title ?? (node.nodeType === NodeType.Feed ? node.data.id : '')}
            nestedLevel={props.nestedLevel}
            showTitle={props.showTitle}
            onContextMenu={handleContextMenuFolder}>
            <FolderSubTreeNode node={node} {...props} />
        </Folder>
    );
};

const MemoizedFolderTreeNode = memo(FolderTreeNode);

if (process.env.MODE === 'dev') {
    FolderTreeNode.whyDidYouRender = true;
}

export default MemoizedFolderTreeNode;
