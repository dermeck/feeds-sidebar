import React, { memo } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';
import { FolderEdit } from './folder-tree/FolderEdit/FolderEdit';
import { MainViewFolderTree } from './folder-tree/MainViewFolderTree';
import { MainViewPlainList } from './plain-list/MainViewPlainList';
import { MainViewDateSortedList } from './date-sorted-list/MainViewDateSortedList';
import { clsx } from 'clsx';

export type MainViewDisplayMode = 'folder-tree' | 'plain-list' | 'date-sorted-list';

type MainViewProps = {
    displayMode: MainViewDisplayMode;
    filterString: string;
};

const MainView = ({ displayMode, filterString }: MainViewProps) => {
    const dispatch = useAppDispatch();
    const showNewFolderInput = useAppSelector((state) => state.session.newFolderEditActive); // TODO mr move to local state

    const handleEditComplete = (title: string) => {
        dispatch(feedsSlice.actions.addFolder(title));
    };

    return (
        <div className="main-view">
            {showNewFolderInput && <FolderEdit initialValue={'New Folder'} onEditComplete={handleEditComplete} />}

            <MainViewFolderTree
                className={clsx(displayMode === 'folder-tree' ? 'view-visible' : 'view-hidden')}
                filterString={filterString}
            />
            <MainViewPlainList
                className={clsx(displayMode === 'plain-list' ? 'view-visible' : 'view-hidden')}
                filterString={filterString}
            />
            <MainViewDateSortedList
                className={clsx(displayMode === 'date-sorted-list' ? 'view-visible' : 'view-hidden')}
                filterString={filterString}
            />
        </div>
    );
};

const MemoizedMainView = memo(MainView);

if (process.env.MODE === 'dev') {
    MainView.whyDidYouRender = true;
}

export { MemoizedMainView as MainView };
