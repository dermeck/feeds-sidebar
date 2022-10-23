import React, { Fragment, memo, useContext, useEffect, useState } from 'react';

import { menuWidthInPx } from '../../base-components/styled/Menu';
import { NodeType } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { selectTreeNode } from '../../store/slices/feeds';
import sessionSlice from '../../store/slices/session';
import useWindowDimensions from '../../utils/hooks/useWindowDimensions';
import Folder from './Folder';
import FolderSubTreeNode from './FolderSubTreeNode';
import { DragDropContext } from './contexts';

interface Props {
    nodeId: string;
    showTitle: boolean;
    nestedLevel: number;
    filterString: string;
}

// TODO find a more robust way to determine menu height
const contextMenuHeight = 64; // 2 menu items, each 32px

const FolderTreeNode = (props: Props) => {
    const node = useAppSelector((state) => selectTreeNode(state.feeds, props.nodeId));
    const selectedId = useAppSelector((state) => state.feeds.selectedNode?.nodeId);
    // only use this for UI rendering effects (insert/before/after indicator, disabled)
    // TODO is this comment still relevant with dragged node in context?
    const { draggedNode } = useContext(DragDropContext);

    const draggedId = draggedNode?.nodeId;

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (node && selectedId === node.data.id && !focus) {
            setFocus(true);
        }
    }, [selectedId]);

    const [expanded, setExpanded] = useState<boolean>(true);
    const [focus, setFocus] = useState<boolean>(false);

    const { height, width } = useWindowDimensions();

    if (!node) {
        return <Fragment />;
    }

    const { id, title } = node.data;

    const handleClickTitle = () => {
        if (id !== undefined) {
            dispatch(feedsSlice.actions.select({ nodeType: node.nodeType, nodeId: id }));
        }
    };

    const handleClickFolder = () => {
        setExpanded(!expanded);
        if (!focus) {
            setFocus(true);
        }
        handleClickTitle();
    };

    const handleBlurFolder = () => {
        if (focus) {
            setFocus(false);
        }
    };

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
            title={title ?? (node.nodeType === NodeType.Feed ? node.data.url : '')}
            nestedLevel={props.nestedLevel}
            showTitle={props.showTitle}
            selected={selectedId === id}
            focus={focus}
            expanded={expanded}
            onClick={handleClickFolder}
            onBlur={handleBlurFolder}
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
