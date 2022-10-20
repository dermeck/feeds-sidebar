import React, { Fragment, memo, useEffect, useState } from 'react';

import { menuWidthInPx } from '../../base-components/styled/Menu';
import { InsertMode, NodeMeta, NodeType } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { selectDescendentNodeIds, selectTreeNode } from '../../store/slices/feeds';
import sessionSlice from '../../store/slices/session';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import { RelativeDragDropPosition } from '../../utils/dragdrop';
import useWindowDimensions from '../../utils/hooks/useWindowDimensions';
import Folder from './Folder';
import FolderSubTreeNode from './FolderSubTreeNode';

interface Props {
    nodeId: string;
    showTitle: boolean;
    nestedLevel: number;
    filterString: string;
    disabled?: boolean;
}

// TODO find a more robust way to determine menu height
const contextMenuHeight = 64; // 2 menu items, each 32px

const FolderTreeNode = (props: Props) => {
    const node = useAppSelector((state) => selectTreeNode(state.feeds, props.nodeId));
    const selectedId = useAppSelector((state) => state.feeds.selectedNode?.nodeId);
    // only use this for UI rendering effects (insert/before/after indicator, disabled)
    const dragged = useAppSelector((state) => state.session.dragged);
    const descendentNodeIds = useAppSelector((state) => selectDescendentNodeIds(state.feeds, props.nodeId));

    const draggedId = dragged?.nodeId;

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

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        const draggedNodeMeta = { nodeId: id, nodeType: node.nodeType };

        event.dataTransfer.setData('invalidDroptTargets', descendentNodeIds.join(';'));
        event.dataTransfer.setData('draggedNodeMeta', JSON.stringify(draggedNodeMeta));

        if (draggedId !== id) {
            dispatch(sessionSlice.actions.changeDragged({ nodeId: id, nodeType: node.nodeType }));
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, relativeDropPosition: RelativeDragDropPosition) => {
        const draggedNodeMeta: NodeMeta = JSON.parse(event.dataTransfer.getData('draggedNodeMeta'));

        if (!draggedNodeMeta) {
            throw new Error('dragged node must be defined.');
        }

        dispatch(
            feedsSlice.actions.moveNode({
                movedNode: draggedNodeMeta,
                targetNodeId: id,
                mode:
                    node.nodeType === NodeType.Folder && draggedNodeMeta.nodeType === NodeType.Feed
                        ? InsertMode.Into
                        : insertModeByRelativeDropPosition(relativeDropPosition),
            }),
        );

        dispatch(sessionSlice.actions.changeDragged(undefined));
    };

    const insertModeByRelativeDropPosition = (relativeDropPosition: RelativeDragDropPosition): InsertMode => {
        switch (relativeDropPosition) {
            case RelativeDragDropPosition.Top:
                return InsertMode.Before;

            case RelativeDragDropPosition.Middle:
                return InsertMode.Into;

            case RelativeDragDropPosition.Bottom:
                return InsertMode.After;

            default:
                throw new UnreachableCaseError(relativeDropPosition);
        }
    };

    const handleDragEnd = () => {
        dispatch(sessionSlice.actions.changeDragged(undefined));
    };

    const disabled =
        (id === draggedId ||
            !!props.disabled ||
            (node.nodeType === NodeType.Feed && dragged?.nodeType === NodeType.Folder)) &&
        draggedId !== undefined;

    return (
        <Folder
            id={id}
            nodeType={node.nodeType}
            title={title ?? (node.nodeType === NodeType.Feed ? node.data.url : '')}
            nestedLevel={props.nestedLevel}
            showTitle={props.showTitle}
            selected={selectedId === id}
            focus={focus}
            expanded={expanded}
            disabled={disabled}
            onClick={handleClickFolder}
            onBlur={handleBlurFolder}
            onContextMenu={handleContextMenuFolder}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}>
            <FolderSubTreeNode node={node} {...props} disabled={disabled} />
        </Folder>
    );
};

const MemoizedFolderTreeNode = memo(FolderTreeNode);

if (process.env.MODE === 'dev') {
    FolderTreeNode.whyDidYouRender = true;
}

export default MemoizedFolderTreeNode;
