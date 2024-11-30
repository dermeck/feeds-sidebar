import React, { memo, useMemo, useRef, useState } from 'react';

import { NodeMeta } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { selectTopLevelNodes } from '../../store/slices/feeds';
import { FolderEdit } from './folder-tree/FolderEdit/FolderEdit';
import { DragDropContext } from './folder-tree/dragdrop/dragdrop-context';
import { MainViewFolderTree } from './folder-tree/MainViewFolderTree';
import { MainViewPlainList } from './plain-list/MainViewPlainList';
import { MainViewDateSortedList } from './date-sorted-list/MainViewDateSortedList';
import { clsx } from 'clsx';
import { useHasScrollbar } from '../../utils/hooks/useHasScrollbar';

export type MainViewDisplayMode = 'folder-tree' | 'plain-list' | 'date-sorted-list';

type MainViewProps = {
    displayMode: MainViewDisplayMode;
    filterString: string;
};

const MainView = ({ displayMode, filterString }: MainViewProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollbarVisible = useHasScrollbar({ ref: scrollContainerRef });
    const dispatch = useAppDispatch();
    const showNewFolderInput = useAppSelector((state) => state.session.newFolderEditActive); // TODO mr move to local state
    const topLevelNodes = useAppSelector((state) => selectTopLevelNodes(state.feeds));

    const handleEditComplete = (title: string) => {
        dispatch(feedsSlice.actions.addFolder(title));
    };

    const [draggedNode, setDraggedNode] = useState<NodeMeta | undefined>(undefined);
    const contextValue = useMemo(() => ({ draggedNode, setDraggedNode }), [draggedNode]);

    return (
        <div className={clsx('main-view', scrollbarVisible && 'main-view--scroll')} ref={scrollContainerRef}>
            {showNewFolderInput && <FolderEdit initialValue={'New Folder'} onEditComplete={handleEditComplete} />}

            <DragDropContext.Provider value={contextValue}>
                <MainViewFolderTree
                    className={clsx(displayMode === 'folder-tree' ? 'view-visble' : 'view-hidden')}
                    nodes={topLevelNodes}
                    filterString={filterString}
                />
            </DragDropContext.Provider>
            <MainViewPlainList
                className={clsx(displayMode === 'plain-list' ? 'view-visible' : 'view-hidden')}
                filterString={filterString}
            />
            <MainViewDateSortedList
                className={clsx(displayMode === 'date-sorted-list' ? 'view-visible' : 'view-hidden')}
                filterString={filterString}
            />
            {scrollbarVisible && <div className="main-view__scrollbar-background" />}
        </div>
    );
};

const MemoizedMainView = memo(MainView);

if (process.env.MODE === 'dev') {
    MainView.whyDidYouRender = true;
}

export { MemoizedMainView as MainView };
