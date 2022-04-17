import React, { FunctionComponent, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { FullHeightScrollContainer } from '../../base-components';
import { FeedNode, FolderNode, NodeType, TopLevelTreeNode } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';
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

    const handleOnEditComplete = (title: string) => {
        dispatch(feedsSlice.actions.addFolder(title));
    };

    const folderNodes: ReadonlyArray<FolderNode> = feeds.folders.map((x) => ({ nodeType: NodeType.Folder, data: x }));

    // TODO add all top-level feeds to a folder "_root_" (so we only need to map folders array)
    const feedNodes: ReadonlyArray<FeedNode> = feeds.feeds.map((x) => ({ nodeType: NodeType.Feed, data: x }));

    const topLevelTreeNodes: Array<TopLevelTreeNode> = [...folderNodes, ...feedNodes];
    console.log('topLevelTreeNodes', topLevelTreeNodes);

    return (
        <FullHeightScrollContainer>
            {showNewFolderInput && <Folder editing={true} onEditComplete={handleOnEditComplete} showTitle={true} />}

            <Virtuoso
                data={topLevelTreeNodes}
                itemContent={(_, node) => (
                    <FolderTreeNode
                        key={node.data.id}
                        node={node}
                        selectedId={feeds.selectedId}
                        showTitle={props.showFeedTitles}
                        filterString={props.filterString}
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
