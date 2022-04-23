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

    const handleOnEditComplete = (title: string) => {
        dispatch(feedsSlice.actions.addFolder(title));
    };

    return (
        <FullHeightScrollContainer>
            {showNewFolderInput && (
                <Folder editing={true} onEditComplete={handleOnEditComplete} showTitle={true} validDropTarget={false} />
            )}

            {topLevelNodes.map((node) => (
                <FolderTreeNode
                    key={node.data.id}
                    nodeId={node.data.id}
                    selectedId={feeds.selectedNodeId}
                    showTitle={props.showFeedTitles}
                    filterString={props.filterString}
                    validDropTarget={true}
                />
            ))}

            {/* TODO check if this is still useful
            <Virtuoso
                data={topLevelNodes}
                itemContent={(_, node) => (
                    <FolderTreeNode
                        key={node.data.id}
                        nodeId={node.data.id}
                        selectedId={feeds.selectedNodeId}
                        showTitle={props.showFeedTitles}
                        filterString={props.filterString}
                        validDropTarget={true}
                    />
                )}
            />
            */}
        </FullHeightScrollContainer>
    );
};

const MemoizedFeedList = memo(FeedList);

if (process.env.MODE === 'dev') {
    FeedList.whyDidYouRender = true;
}

export default MemoizedFeedList;
