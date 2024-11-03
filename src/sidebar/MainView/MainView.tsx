import React, { memo, useMemo, useState } from 'react';

import { NodeMeta } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { selectTopLevelNodes } from '../../store/slices/feeds';
import { FolderEdit } from './folder-tree/FolderEdit/FolderEdit';
import FolderTreeNode from './folder-tree/FolderTreeNode';
import { DragDropContext } from './folder-tree/dragdrop/dragdrop-context';

interface Props {
    showFeedTitles: boolean; // TODO view: 'list' | 'folder' | 'date'
    filterString: string;
}

const MainView = (props: Props) => {
    const dispatch = useAppDispatch();
    const showNewFolderInput = useAppSelector((state) => state.session.newFolderEditActive); // TODO mr move to local state
    const topLevelNodes = useAppSelector((state) => selectTopLevelNodes(state.feeds));

    const handleEditComplete = (title: string) => {
        dispatch(feedsSlice.actions.addFolder(title));
    };

    const [draggedNode, setDraggedNode] = useState<NodeMeta | undefined>(undefined);
    const contextValue = useMemo(() => ({ draggedNode, setDraggedNode }), [draggedNode]);

    return (
        <DragDropContext.Provider value={contextValue}>
            <div className="sidebar__content">
                {showNewFolderInput && <FolderEdit initialValue={'New Folder'} onEditComplete={handleEditComplete} />}
                {topLevelNodes.map((node) => (
                    <FolderTreeNode
                        key={node.data.id}
                        nodeId={node.data.id}
                        nestedLevel={0}
                        showTitle={props.showFeedTitles}
                        filterString={props.filterString}
                    />
                ))}
            </div>
        </DragDropContext.Provider>
    );
};

const MemoizedMainView = memo(MainView);

if (process.env.MODE === 'dev') {
    MainView.whyDidYouRender = true;
}

export { MemoizedMainView as MainView };
