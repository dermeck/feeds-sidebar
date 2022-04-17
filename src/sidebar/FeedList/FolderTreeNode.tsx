import styled from '@emotion/styled';

import React, { Fragment, FunctionComponent, memo, useEffect, useState } from 'react';

import { menuWidthInPx } from '../../base-components/styled/Menu';
import { Feed as FeedType } from '../../model/feeds';
import { useAppDispatch } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';
import sessionSlice from '../../store/slices/session';
import useWindowDimensions from '../../utils/hooks/useWindowDimensions';
import FeedItem from './FeedItem';
import Folder from './Folder';

/*interface Props {
    feed: FeedType;
    selectedId: string;
    showTitle: boolean;
    filterString: string;
}*/

interface Props {
    id?: string;
    title?: string;
    children?: React.ReactNode;
    // selected?: boolean;
    selectedId?: string;
    // focus?: boolean;
    // expanded?: boolean;
    // editing?: boolean;
    // handleOnClick?: () => void;
    // handleOnBlur?: () => void;
    // handleOnContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    // onEditComplete?: (x: string) => void;
}

// TODO find a more robust way to determine menu height
const contextMenuHeight = 64; // 2 menu items, each 32px

const FolderTreeNode = (props: Props) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.selectedId === props.id) {
            setFocus(true);
        }
    }, [props.selectedId]);

    const [expanded, setExpanded] = useState<boolean>(true);
    const [focus, setFocus] = useState<boolean>(false);

    const { height, width } = useWindowDimensions();

    const handleOnClickTitle = () => {
        if (props.id !== undefined) {
            dispatch(feedsSlice.actions.select(props.id));
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

        if (props.id !== undefined) {
            dispatch(feedsSlice.actions.select(props.id));
        }
    };

    return (
        <Folder
            title={props.title}
            selected={props.selectedId === props.id}
            focus={focus}
            expanded={expanded}
            handleOnClick={handleOnClickFolder}
            handleOnBlur={handleOnBlurFolder}
            handleOnContextMenu={handleOnContextMenuFolder}>
            {<div>moep</div>}
        </Folder>
    );
};

const MemoizedFolderTreeNode = memo(FolderTreeNode);

if (process.env.MODE === 'dev') {
    FolderTreeNode.whyDidYouRender = true;
}

export default MemoizedFolderTreeNode;
