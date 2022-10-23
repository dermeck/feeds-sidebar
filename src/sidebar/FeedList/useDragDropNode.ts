import { useContext } from 'react';

import { NodeMeta } from '../../model/feeds';
import { useAppSelector } from '../../store/hooks';
import { selectDescendentNodeIds } from '../../store/slices/feeds';
import { DragDropContext } from './contexts';

const useDragDropNode = (nodeMeta: NodeMeta) => {
    const { draggedNode, setDraggedNode } = useContext(DragDropContext);
    const descendentNodeIds = useAppSelector((state) => selectDescendentNodeIds(state.feeds, nodeMeta.nodeId));

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('invalidDroptTargets', descendentNodeIds.join(';'));
        event.dataTransfer.setData('draggedNodeMeta', JSON.stringify(nodeMeta));

        if (draggedNode?.nodeId !== nodeMeta.nodeId) {
            setDraggedNode(nodeMeta);
        }
    };

    return {
        handleDragStart,
    };
};

export default useDragDropNode;
