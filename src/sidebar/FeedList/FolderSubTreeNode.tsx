import styled from '@emotion/styled';

import React, { Fragment } from 'react';

import { NodeType, Feed, TreeNode } from '../../model/feeds';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import FeedItem from './FeedItem';
import FolderTreeNode from './FolderTreeNode';

const FeedContainer = styled.ul<{ disabled: boolean }>`
    padding-left: 0;
    margin: 0;
    opacity: ${(props) => (props.disabled ? 0.3 : 0.9)};
`;

interface FeedItemsprops {
    feed: Feed;
    selectedId?: string;
    indented: boolean;
    nestedLevel: number;
    filterString: string;
    disabled: boolean;
}

const FeedItems = (props: FeedItemsprops) => {
    if (!props.feed.items.some((x) => !x.isRead || x.id === props.selectedId)) {
        return <Fragment />;
    }

    return (
        <FeedContainer disabled={props.disabled}>
            {props.feed.items.map(
                (item) =>
                    item.title?.toLowerCase().includes(props.filterString.toLowerCase()) && (
                        <FeedItem
                            key={item.id + item.title}
                            feedId={props.feed.id}
                            item={item}
                            indented={props.indented}
                            nestedLevel={props.nestedLevel}
                        />
                    ),
            )}
        </FeedContainer>
    );
};

interface Props {
    node: TreeNode;
    selectedId?: string;
    showTitle: boolean;
    nestedLevel: number;
    filterString: string;
    validDropTarget: boolean;
}

const FolderSubTreeNode = (props: Props): JSX.Element => {
    const { node, filterString, showTitle, selectedId, validDropTarget, nestedLevel } = props;

    switch (node.nodeType) {
        case NodeType.Feed:
            return (
                <Fragment>
                    {node.nodeType === NodeType.Feed && (
                        <FeedItems
                            key={node.data.id}
                            feed={node.data}
                            filterString={filterString}
                            indented={showTitle}
                            nestedLevel={nestedLevel + 1}
                            selectedId={selectedId}
                            disabled={!props.validDropTarget}
                        />
                    )}
                </Fragment>
            );

        case NodeType.Folder: {
            const childIds = [...node.data.subfolderIds, ...node.data.feedIds];

            return (
                <Fragment>
                    {childIds.map((childId) => {
                        return (
                            <FolderTreeNode
                                key={childId}
                                nodeId={childId}
                                selectedId={selectedId}
                                nestedLevel={nestedLevel + 1}
                                showTitle={showTitle}
                                filterString={filterString}
                                validDropTarget={validDropTarget}
                            />
                        );
                    })}
                </Fragment>
            );
        }

        default:
            throw new UnreachableCaseError(node);
    }
};

export default FolderSubTreeNode;
