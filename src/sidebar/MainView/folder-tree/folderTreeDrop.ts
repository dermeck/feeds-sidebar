import { Folder, InsertMode, NodeMeta, NodeType } from '../../../model/feeds';
import { selectDescendentNodeIds } from '../../../store/slices/feeds';

export type TreeDropPosition = 'before' | 'after' | 'on';

export const canDropNode = (
    dragged: NodeMeta,
    target: NodeMeta,
    position: TreeDropPosition,
    folders: ReadonlyArray<Folder>,
): boolean => {
    if (dragged.nodeId === target.nodeId) {
        return false;
    }

    if (
        dragged.nodeType === NodeType.Folder &&
        selectDescendentNodeIds([], folders, dragged.nodeId).includes(target.nodeId)
    ) {
        return false;
    }

    if (target.nodeType === NodeType.Feed) {
        return dragged.nodeType === NodeType.Feed && position !== 'on';
    }

    return dragged.nodeType === NodeType.Feed ? position === 'on' : true;
};

export const insertModeByDropPosition = (position: TreeDropPosition): InsertMode =>
    position === 'on' ? InsertMode.Into : position === 'before' ? InsertMode.Before : InsertMode.After;
