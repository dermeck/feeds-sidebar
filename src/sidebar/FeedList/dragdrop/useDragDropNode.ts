import { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

import { InsertMode, NodeMeta, NodeType } from '../../../model/feeds';
import { useAppSelector } from '../../../store/hooks';
import feedsSlice, { selectDescendentNodeIds } from '../../../store/slices/feeds';
import { UnreachableCaseError } from '../../../utils/UnreachableCaseError';
import { RelativeDragDropPosition, relativeDragDropPosition } from '../../../utils/dragdrop';
import { DragDropContext } from './dragdrop-context';

const calculateRelativeDragDropPosition = (
    draggedNodeType: NodeType,
    targetNodeType: NodeType,
    event: React.DragEvent<HTMLDivElement>,
) => {
    let value = undefined;
    if (draggedNodeType === NodeType.Feed && targetNodeType === NodeType.Folder) {
        // feeds can only be inserted into folders
        value = RelativeDragDropPosition.Middle;
    } else if (draggedNodeType === NodeType.Feed && targetNodeType === NodeType.Feed) {
        // feeds can only be sorted
        value = relativeDragDropPosition(event, 0.5);
    } else if (draggedNodeType === NodeType.Folder && targetNodeType === NodeType.Folder) {
        value = relativeDragDropPosition(event, 0.15);
    } else {
        throw new Error(`${draggedNodeType} can not be dropped on ${targetNodeType}.`);
    }
    return value;
};

const useDragDropNode = (nodeMeta: NodeMeta) => {
    const dispatch = useDispatch();
    const { draggedNode, setDraggedNode } = useContext(DragDropContext);

    // only use this for UI rendering effects (insert/before/after indicator)
    // TODO check if we really need it separately for drop
    const [relativeDropPosition, setRelativDropPosition] = useState<RelativeDragDropPosition | undefined>(undefined);

    const descendentNodeIds = useAppSelector((state) => selectDescendentNodeIds(state.feeds, nodeMeta.nodeId));
    const draggedNodeDescendents = useAppSelector((state) =>
        draggedNode ? selectDescendentNodeIds(state.feeds, draggedNode.nodeId) : [],
    );

    const isDropNotAllowed =
        nodeMeta.nodeId === draggedNode?.nodeId ||
        draggedNodeDescendents.includes(nodeMeta.nodeId) ||
        (nodeMeta.nodeType === NodeType.Feed &&
            draggedNode?.nodeType === NodeType.Folder &&
            draggedNode?.nodeId !== undefined);

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('invalidDroptTargets', descendentNodeIds.join(';'));
        event.dataTransfer.setData('draggedNodeMeta', JSON.stringify(nodeMeta));

        if (draggedNode?.nodeId !== nodeMeta.nodeId) {
            setDraggedNode(nodeMeta);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        if (event.dataTransfer.getData('draggedNodeMeta') === '') {
            // if drag over happens very fast this might not be set properly
            return;
        }

        const invalidDroptTargets = event.dataTransfer.getData('invalidDroptTargets').split(';');

        if (invalidDroptTargets.find((x) => x === nodeMeta.nodeId)) {
            return;
        }

        const dragged: NodeMeta = JSON.parse(event.dataTransfer.getData('draggedNodeMeta'));

        if (!isDropNotAllowed) {
            setRelativDropPosition(calculateRelativeDragDropPosition(dragged.nodeType, nodeMeta.nodeType, event));

            event.preventDefault();
        }
    };

    const handleDragLeave = () => {
        if (relativeDropPosition !== undefined) {
            setRelativDropPosition(undefined);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        const invalidDroptTargets = event.dataTransfer.getData('invalidDroptTargets').split(';');

        if (invalidDroptTargets.find((x) => x === nodeMeta.nodeId)) {
            return;
        }

        const dragged: NodeMeta = JSON.parse(event.dataTransfer.getData('draggedNodeMeta'));

        // recalculate here, don't rely on local state set in handleDragover
        // handleDragover is dependend on props.disabled which depends on global store so there can be timing issues
        // (local) relativeDropPosition can be undefined if drag/drop happens very fast
        // TODO check if this is still a problem with dragged node in context!
        const relativeDropPosition = calculateRelativeDragDropPosition(dragged.nodeType, nodeMeta.nodeType, event);

        if (relativeDropPosition === undefined) {
            throw new Error('Illegal state: relativeDropPosition must be definend when handleDrop is called.');
        }

        doDrop(event, relativeDropPosition);

        setRelativDropPosition(undefined);
    };

    const doDrop = (event: React.DragEvent<HTMLDivElement>, relativeDropPosition: RelativeDragDropPosition) => {
        const draggedNodeMeta: NodeMeta = JSON.parse(event.dataTransfer.getData('draggedNodeMeta'));

        if (!draggedNodeMeta) {
            // TODO can this actually happen?
            throw new Error('dragged node must be defined.');
        }

        dispatch(
            feedsSlice.actions.moveNode({
                movedNode: draggedNodeMeta,
                targetNodeId: nodeMeta.nodeId,
                mode:
                    nodeMeta.nodeType === NodeType.Folder && draggedNodeMeta.nodeType === NodeType.Feed
                        ? InsertMode.Into
                        : insertModeByRelativeDropPosition(relativeDropPosition),
            }),
        );

        setDraggedNode(undefined);
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
        setDraggedNode(undefined);
    };

    return {
        isDropNotAllowed,
        relativeDropPosition,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
    };
};

export default useDragDropNode;
