import React, { FunctionComponent, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { FullHeightScrollContainer } from '../../base-components';
import { NodeType } from '../../model/feeds';
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
    const showNewFolderInput = useAppSelector((state) => state.session.newFolderEditActive);
    const topLevelNodes = useAppSelector((state) => selectTopLevelNodes(state.feeds));

    const handleEditComplete = (title: string) => {
        dispatch(feedsSlice.actions.addFolder(title));
    };

    return (
        <FullHeightScrollContainer>
            {showNewFolderInput && (
                <Folder
                    editing={true}
                    nodeType={NodeType.Folder}
                    onEditComplete={handleEditComplete}
                    showTitle={true}
                    nestedLevel={0}
                />
            )}

            {
                // TODO Fix rendering problem and also vitualize the flat list
                // Virtuoso causes an issue: on reload / browser start the flat list won't render if there are only a few items
                props.showFeedTitles ? (
                    <Virtuoso
                        data={topLevelNodes}
                        itemContent={(_, node) => (
                            <FolderTreeNode
                                key={node.data.id}
                                nodeId={node.data.id}
                                nestedLevel={0}
                                showTitle={props.showFeedTitles}
                                filterString={props.filterString}
                            />
                        )}
                    />
                ) : (
                    topLevelNodes.map((node) => (
                        <FolderTreeNode
                            key={node.data.id}
                            nodeId={node.data.id}
                            nestedLevel={0}
                            showTitle={props.showFeedTitles}
                            filterString={props.filterString}
                        />
                    ))
                )
            }
        </FullHeightScrollContainer>
    );
};

const MemoizedFeedList = memo(FeedList);

if (process.env.MODE === 'dev') {
    FeedList.whyDidYouRender = true;
}

export default MemoizedFeedList;
