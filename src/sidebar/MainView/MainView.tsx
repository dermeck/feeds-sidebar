import React, { memo, useMemo, useState } from 'react';

import { NodeMeta } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { selectTopLevelNodes } from '../../store/slices/feeds';
import { FolderEdit } from './folder-tree/FolderEdit/FolderEdit';
import { DragDropContext } from './folder-tree/dragdrop/dragdrop-context';
import { MainViewFolderTree } from './folder-tree/MainViewFolderTree';
import { MainViewPlainList } from './plain-list/MainViewPlainList';

interface Props {
    displayMode: 'folder-tree' | 'plain-list' | 'date-sorted-list';
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

                {props.displayMode === 'folder-tree' && (
                    // TODO mr only add DragDropCOntext ü FolderEdit in this view?
                    <MainViewFolderTree nodes={topLevelNodes} filterString={props.filterString} />
                )}
                {props.displayMode === 'plain-list' && <MainViewPlainList filterString={props.filterString} />}
                {props.displayMode === 'date-sorted-list' && (
                    // TODO mr implement MainViewDateSortedList
                    <MainViewPlainList filterString={props.filterString} />
                )}
            </div>
        </DragDropContext.Provider>
    );
};

const MemoizedMainView = memo(MainView);

if (process.env.MODE === 'dev') {
    MainView.whyDidYouRender = true;
}

export { MemoizedMainView as MainView };
