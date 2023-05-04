import { useContext, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { InsertMode, NodeMeta, NodeType } from '../../../model/feeds';
import { useAppSelector } from '../../../store/hooks';
import feedsSlice, { makeselectDescendentNodeIds } from '../../../store/slices/feeds';
import { UnreachableCaseError } from '../../../utils/UnreachableCaseError';
import { RelativeDragDropPosition, relativeDragDropPosition } from '../../../utils/dragdrop';
import useNamedCallback from '../../../utils/hooks/useNamedCallback';
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

const useDragDropNode = (nodeMeta: NodeMeta) => {
    const dispatch = useDispatch();
    const { draggedNode, setDraggedNode } = useContext(DragDropContext);

    const [relativeDropPosition, setRelativDropPosition] = useState<RelativeDragDropPosition | undefined>(undefined);

    const selectDescendentNodeIds = useMemo(makeselectDescendentNodeIds, [draggedNode]);
    const draggedNodeDescendents = useAppSelector((state) => selectDescendentNodeIds(state.feeds, draggedNode?.nodeId));

    const isDropNotAllowed =
        nodeMeta.nodeId === draggedNode?.nodeId ||
        draggedNodeDescendents.includes(nodeMeta.nodeId) ||
        (draggedNode !== undefined && draggedNode.nodeType === NodeType.Folder && nodeMeta.nodeType === NodeType.Feed);

    const handleDragStart = useNamedCallback(
        'handleDragStart',
        () => {
            if (draggedNode?.nodeId !== nodeMeta.nodeId) {
                setDraggedNode(nodeMeta);
            }
        },
        [draggedNode],
    );

    const handleDragOver = useNamedCallback(
        'handleDragOver',
        (event: React.DragEvent<HTMLDivElement>) => {
            if (draggedNode === undefined) {
                // if drag over happens very fast this might not be set properly
                return;
            }

            if (!isDropNotAllowed) {
                setRelativDropPosition(
                    calculateRelativeDragDropPosition(draggedNode.nodeType, nodeMeta.nodeType, event),
                );

                event.preventDefault();
            }
        },
        [draggedNode, isDropNotAllowed],
    );

    const handleDragLeave = useNamedCallback(
        'useNamesCallback',
        () => {
            if (relativeDropPosition !== undefined) {
                setRelativDropPosition(undefined);
            }
        },
        [relativeDropPosition],
    );

    const handleDrop = useNamedCallback(
        'useNamedCallback',
        () => {
            if (isDropNotAllowed || draggedNode === undefined || relativeDropPosition === undefined) {
                console.warn(
                    `Could not drop node ${draggedNode} on node ${nodeMeta}, position: ${relativeDragDropPosition}`,
                );

                return;
            }

            dispatch(
                feedsSlice.actions.moveNode({
                    movedNode: draggedNode,
                    targetNodeId: nodeMeta.nodeId,
                    mode: insertModeByRelativeDropPosition(relativeDropPosition),
                }),
            );

            setDraggedNode(undefined);
            setRelativDropPosition(undefined);
        },
        [isDropNotAllowed, draggedNode, relativeDropPosition],
    );

    const handleDragEnd = useNamedCallback(
        'handleDragEnd',
        () => {
            setDraggedNode(undefined);
            setRelativDropPosition(undefined);
        },
        [],
    );

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
