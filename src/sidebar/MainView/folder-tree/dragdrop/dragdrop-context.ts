import { createContext, Dispatch, SetStateAction } from 'react';

import { NodeMeta } from '../../../../model/feeds';

export const DragDropContext = createContext<{
    draggedNode: NodeMeta | undefined;
    setDraggedNode: Dispatch<SetStateAction<NodeMeta | undefined>>;
}>({ draggedNode: undefined, setDraggedNode: () => undefined });
