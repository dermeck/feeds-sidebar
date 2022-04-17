import styled from '@emotion/styled';

import React, { Fragment } from 'react';

import { NodeType, Feed, TreeNode } from '../../model/feeds';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import FeedItem from './FeedItem';
import FolderTreeNode from './FolderTreeNode';

const FeedContainer = styled.ul`
    padding-left: 0;
    margin: 0;
    opacity: 0.9;
`;

interface FeedItemsprops {
    feed: Feed;
    selectedId?: string;
    showTitle: boolean;
    filterString: string;
}

const FeedItems = (props: FeedItemsprops) => {
    if (!props.feed.items.some((x) => !x.isRead || x.id === props.selectedId)) {
        return <Fragment />;
    }

    return (
        <FeedContainer>
            {props.feed.items.map(
                (item) =>
                    item.title?.toLowerCase().includes(props.filterString.toLowerCase()) && (
                        <FeedItem
                            key={item.id + item.title}
                            feedId={props.feed.id}
                            item={item}
                            indented={props.showTitle}
                        />
                    ),
            )}
        </FeedContainer>
    );
};

const SubFolderWrapper = styled.div<{ indented: boolean }>`
    padding-left: ${(props) => (props.indented ? '15px' : 0)};
`;

interface Props {
    node: TreeNode;
    selectedId?: string;
    showTitle: boolean;
    filterString: string;
}

const FolderSubTreeNode = (props: Props): JSX.Element => {
    const { node, filterString, showTitle, selectedId } = props;

    switch (node.nodeType) {
        case NodeType.Feed:
            return (
                <Fragment>
                    {node.nodeType === NodeType.Feed && (
                        <FeedItems
                            key={node.data.id}
                            feed={node.data}
                            filterString={filterString}
                            showTitle={showTitle}
                            selectedId={selectedId}
                        />
                    )}
                </Fragment>
            );

        case NodeType.Folder: {
            const childIds = [...node.data.subFolders, ...node.data.feedIds];

            return (
                <SubFolderWrapper indented={showTitle}>
                    {childIds.map((childId) => {
                        return (
                            <FolderTreeNode
                                key={childId}
                                nodeId={childId}
                                selectedId={selectedId}
                                showTitle={showTitle}
                                filterString={filterString}
                            />
                        );
                    })}
                </SubFolderWrapper>
            );
        }

        default:
            throw new UnreachableCaseError(node);
    }
};

export default FolderSubTreeNode;
