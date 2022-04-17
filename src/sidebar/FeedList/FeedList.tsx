import React, { FunctionComponent, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { FullHeightScrollContainer } from '../../base-components';
import { FeedNode, FolderNode, NodeType, TopLevelTreeNode } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import Feed from './Feed';
import Folder from './Folder';

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

    const folderNodes: ReadonlyArray<FolderNode> = feeds.folders.map((x) => ({ nodeType: NodeType.Folder, folder: x }));

    // TODO add all top-level feeds to a folder "_root_" (so we only need to map folders array)
    const feedNodes: ReadonlyArray<FeedNode> = feeds.feeds.map((x) => ({ nodeType: NodeType.Feed, feed: x }));

    const topLevelTreeNodes: Array<TopLevelTreeNode> = [...folderNodes, ...feedNodes];

    return (
        <FullHeightScrollContainer>
            {showNewFolderInput && <Folder editing={true} onEditComplete={handleOnEditComplete} />}

            <Virtuoso
                data={topLevelTreeNodes}
                itemContent={(_, node) => {
                    switch (node.nodeType) {
                        case NodeType.Folder:
                            return <Folder key={node.folder.id} title={node.folder.title} />;

                        case NodeType.Feed:
                            return (
                                <Feed
                                    key={node.feed.id}
                                    selectedId={feeds.selectedId}
                                    feed={node.feed}
                                    showTitle={props.showFeedTitles}
                                    filterString={props.filterString}
                                />
                            );

                        default:
                            throw new UnreachableCaseError(node);
                    }
                }}
            />
        </FullHeightScrollContainer>
    );
};

const MemoizedFeedList = memo(FeedList);

if (process.env.MODE === 'dev') {
    FeedList.whyDidYouRender = true;
}

export default MemoizedFeedList;
