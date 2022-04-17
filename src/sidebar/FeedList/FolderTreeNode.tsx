import styled from '@emotion/styled';

import React, { Fragment, memo, useEffect, useState } from 'react';

import { menuWidthInPx } from '../../base-components/styled/Menu';
import { Feed, FeedNode, FolderNode, NodeType } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { selectTreeNode } from '../../store/slices/feeds';
import sessionSlice from '../../store/slices/session';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import useWindowDimensions from '../../utils/hooks/useWindowDimensions';
import FeedItem from './FeedItem';
import Folder from './Folder';

interface Props {
    nodeId: string;
    selectedId?: string;
    showTitle: boolean;
    filterString: string;
}

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

const renderChildren = (props: Props, node: FolderNode | FeedNode): React.ReactNode => {
    switch (node.nodeType) {
        case NodeType.Feed:
            return (
                node.nodeType === NodeType.Feed && (
                    <FeedItems
                        key={node.data.id}
                        feed={node.data}
                        filterString={props.filterString}
                        showTitle={props.showTitle}
                        selectedId={props.selectedId}
                    />
                )
            );

        case NodeType.Folder:
            // TODO
            //props.node.data.subFolders.map(f => <FolderTreeNode node={}/>);
            return 'folder';

        default:
            throw new UnreachableCaseError(node);
    }
};

// TODO find a more robust way to determine menu height
const contextMenuHeight = 64; // 2 menu items, each 32px

const FolderTreeNode = (props: Props) => {
    const node = useAppSelector((state) => selectTreeNode(state, props.nodeId));

    const { id, title } = node.data;

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.selectedId === id) {
            setFocus(true);
        }
    }, [props.selectedId]);

    const [expanded, setExpanded] = useState<boolean>(true);
    const [focus, setFocus] = useState<boolean>(false);

    const { height, width } = useWindowDimensions();

    const handleOnClickTitle = () => {
        if (id !== undefined) {
            dispatch(feedsSlice.actions.select(id));
        }
    };

    const handleOnClickFolder = () => {
        setExpanded(!expanded);
        setFocus(true);
        handleOnClickTitle();
    };

    const handleOnBlurFolder = () => {
        setFocus(false);
    };

    const handleOnContextMenuFolder = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();

        if (width === undefined || height === undefined) {
            console.error('Could not open context menu. Unable to determine dimensions of window.');
            return;
        }

        const x = width - e.clientX < menuWidthInPx ? width - menuWidthInPx : e.clientX;
        const y = height - e.clientY < contextMenuHeight ? height - contextMenuHeight : e.clientY;

        dispatch(sessionSlice.actions.showContextMenu({ x, y }));

        if (id !== undefined) {
            dispatch(feedsSlice.actions.select(id));
        }
    };

    return (
        <Folder
            title={title ?? (node.nodeType === NodeType.Feed ? node.data.url : '')}
            showTitle={props.showTitle}
            selected={props.selectedId === id}
            focus={focus}
            expanded={expanded}
            handleOnClick={handleOnClickFolder}
            handleOnBlur={handleOnBlurFolder}
            handleOnContextMenu={handleOnContextMenuFolder}>
            {renderChildren(props, node)}
        </Folder>
    );
};

const MemoizedFolderTreeNode = memo(FolderTreeNode);

if (process.env.MODE === 'dev') {
    FolderTreeNode.whyDidYouRender = true;
}

export default MemoizedFolderTreeNode;
