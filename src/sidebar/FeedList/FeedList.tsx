import React, { FunctionComponent, memo, useMemo, useState } from 'react';

import { FullHeightScrollContainer } from '../../base-components';
import { NodeMeta } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { selectTopLevelNodes } from '../../store/slices/feeds';
import FolderEdit from './FolderEdit';
import FolderTreeNode from './FolderTreeNode';
import { DragDropContext } from './dragdrop/dragdrop-context';

interface Props {
    showFeedTitles: boolean; // TODO view: 'list' | 'folder' | 'date'
    filterString: string;
}

const FeedList: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();
    const showNewFolderInput = useAppSelector((state) => state.session.newFolderEditActive);
    const topLevelNodes = useAppSelector((state) => selectTopLevelNodes(state.feeds));

    const handleEditComplete = (title: string) => {
        dispatch(feedsSlice.actions.addFolder(title));
    };

    const [draggedNode, setDraggedNode] = useState<NodeMeta | undefined>(undefined);
    const contextValue = useMemo(() => ({ draggedNode, setDraggedNode }), [draggedNode]);

    return (
        <DragDropContext.Provider value={contextValue}>
            <FullHeightScrollContainer>
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
            </FullHeightScrollContainer>
        </DragDropContext.Provider>
    );
};

const MemoizedFeedList = memo(FeedList);

if (process.env.MODE === 'dev') {
    FeedList.whyDidYouRender = true;
}

export default MemoizedFeedList;
