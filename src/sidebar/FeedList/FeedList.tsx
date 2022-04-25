import React, { FunctionComponent, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { FullHeightScrollContainer } from '../../base-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { selectTopLevelNodes } from '../../store/slices/feeds';
import Folder from './Folder';
import FolderTreeNode from './FolderTreeNode';

interface Props {
    showFeedTitles: boolean;
    filterString: string;
}

const FeedList: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds);
    const showNewFolderInput = useAppSelector((state) => state.session.newFolderEditActive);
    const topLevelNodes = useAppSelector(selectTopLevelNodes);

    const handleEditComplete = (title: string) => {
        dispatch(feedsSlice.actions.addFolder(title));
    };

    return (
        <FullHeightScrollContainer>
            {showNewFolderInput && (
                <Folder
                    editing={true}
                    onEditComplete={handleEditComplete}
                    showTitle={true}
                    validDropTarget={false}
                    nestedLevel={0}
                />
            )}

            <Virtuoso
                data={topLevelNodes}
                itemContent={(_, node) => (
                    <FolderTreeNode
                        key={node.data.id}
                        nodeId={node.data.id}
                        selectedId={feeds.selectedNode?.nodeId}
                        nestedLevel={0}
                        showTitle={props.showFeedTitles}
                        filterString={props.filterString}
                        validDropTarget={true}
                    />
                )}
            />
        </FullHeightScrollContainer>
    );
};

const MemoizedFeedList = memo(FeedList);

if (process.env.MODE === 'dev') {
    FeedList.whyDidYouRender = true;
}

export default MemoizedFeedList;
