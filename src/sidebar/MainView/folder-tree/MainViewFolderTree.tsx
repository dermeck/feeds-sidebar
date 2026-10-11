import React, { useMemo, useRef, useState } from 'react';
import { Collection, Key, Selection, Tree, TreeItem, useDragAndDrop } from 'react-aria-components';

import { NodeMeta } from '../../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import feedsSlice, {
    nodeMetaById,
    selectFeeds,
    selectFolderIds,
    selectFolders,
    selectSelectedNode,
    selectTreeItems,
    TreeViewItem,
} from '../../../store/slices/feeds';
import { canDropNode, insertModeByDropPosition } from './folderTreeDrop';
import { FolderTreeArticleList } from './FolderTreeArticleList';
import { FolderTreeItem } from './FolderTreeItem';

const nodeDragType = 'application/x-feeds-sidebar-tree-node';

const useFolderTreeDragDrop = () => {
    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => selectFeeds(state.feeds));
    const folders = useAppSelector((state) => selectFolders(state.feeds));
    const draggedRef = useRef<NodeMeta | undefined>(undefined);
    const [isDragging, setDragging] = useState(false);

    const metaOfKey = (key: Key) => (typeof key === 'string' ? nodeMetaById(folders, feeds, key) : undefined);

    const { dragAndDropHooks } = useDragAndDrop<TreeViewItem>({
        getItems: (_, items) => items.map((item) => ({ 'text/plain': item.title, [nodeDragType]: item.id })),
        getAllowedDropOperations: () => ['move'],
        onDragStart: (e) => {
            draggedRef.current = metaOfKey([...e.keys][0]);
            setDragging(true);
        },
        onDragEnd: () => {
            draggedRef.current = undefined;
            setDragging(false);
        },
        getDropOperation: (target) => {
            const dragged = draggedRef.current;

            if (target.type !== 'item' || dragged === undefined) {
                return 'cancel';
            }

            const meta = metaOfKey(target.key);

            return meta !== undefined && canDropNode(dragged, meta, target.dropPosition, folders) ? 'move' : 'cancel';
        },
        shouldAcceptItemDrop: (target) => {
            const dragged = draggedRef.current;
            const meta = metaOfKey(target.key);

            return dragged !== undefined && meta !== undefined && canDropNode(dragged, meta, 'on', folders);
        },
        onMove: (e) => {
            const dragged = draggedRef.current;
            const meta = metaOfKey(e.target.key);

            if (dragged === undefined || e.keys.size !== 1 || meta === undefined) {
                return;
            }

            if (!canDropNode(dragged, meta, e.target.dropPosition, folders)) {
                return;
            }

            dispatch(
                feedsSlice.actions.moveNode({
                    movedNode: dragged,
                    targetNodeId: meta.nodeId,
                    mode: insertModeByDropPosition(e.target.dropPosition),
                }),
            );
        },
    });

    return { dragAndDropHooks, isDragging };
};

const renderTreeItem = (item: TreeViewItem) => (
    <TreeItem id={item.id} textValue={item.title} className="folder">
        <FolderTreeItem item={item} />
        {item.children ? <Collection items={item.children}>{renderTreeItem}</Collection> : null}
    </TreeItem>
);

type MainViewFolderTreeProps = {
    className: string;
    filterString: string;
};

export const MainViewFolderTree = ({ className, filterString }: MainViewFolderTreeProps) => {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => selectTreeItems(state.feeds));
    const folderIds = useAppSelector((state) => selectFolderIds(state.feeds));
    const folders = useAppSelector((state) => selectFolders(state.feeds));
    const feeds = useAppSelector((state) => selectFeeds(state.feeds));
    const selectedNode = useAppSelector((state) => selectSelectedNode(state.feeds));

    const { dragAndDropHooks, isDragging } = useFolderTreeDragDrop();

    // only collapsed folders are tracked so newly added folders are expanded by default
    const [collapsedKeys, setCollapsedKeys] = useState<ReadonlySet<string>>(new Set());
    const expandedKeys = useMemo(
        () => new Set(folderIds.filter((id) => !collapsedKeys.has(id))),
        [folderIds, collapsedKeys],
    );

    const selectedKeys = useMemo(
        () => new Set(selectedNode === undefined ? [] : [selectedNode.nodeId]),
        [selectedNode],
    );

    const handleExpandedChange = (keys: Set<Key>) => {
        setCollapsedKeys(new Set(folderIds.filter((id) => !keys.has(id))));
    };

    const handleSelectionChange = (keys: Selection) => {
        if (keys === 'all') {
            return;
        }

        const id = [...keys][0];

        if (typeof id !== 'string') {
            return;
        }

        const meta = nodeMetaById(folders, feeds, id);

        if (meta !== undefined) {
            dispatch(feedsSlice.actions.select(meta));
        }
    };

    return (
        <div className={className}>
            <Tree
                aria-label="Feeds"
                className="folder-tree"
                items={items}
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={selectedKeys}
                onSelectionChange={handleSelectionChange}
                expandedKeys={expandedKeys}
                onExpandedChange={handleExpandedChange}
                dragAndDropHooks={dragAndDropHooks}>
                {renderTreeItem}
            </Tree>
            <FolderTreeArticleList filterString={filterString} disabled={isDragging} />
        </div>
    );
};
