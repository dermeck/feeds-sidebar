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

const FeedContainer = styled.ul`
    padding-left: 0;
    margin: 0;
    opacity: 0.9;
`;

interface Props {
    feed: FeedType;
    selectedId: string;
    showTitle: boolean;
    filterString: string;
}

const renderItems = (props: Props) => {
    if (!props.feed.items.some((x) => x.isRead || x.id === props.selectedId)) {
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

// TODO find a more robust way to determine menu height
const contextMenuHeight = 64; // 2 menu items, each 32px

const Feed: FunctionComponent<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.selectedId === props.feed.id) {
            setFocus(true);
        }
    }, [props.selectedId]);

    const [expanded, setExpanded] = useState<boolean>(true);
    const [focus, setFocus] = useState<boolean>(false);

    const { height, width } = useWindowDimensions();

    const handleFeedTitleClick = () => {
        dispatch(feedsSlice.actions.select(props.feed.id));
    };

    if (!props.showTitle) {
        // only show links, no folder
        return renderItems(props);
    }

    const handleOnClickFolder = () => {
        setExpanded(!expanded);
        setFocus(true);
        handleFeedTitleClick();
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
        dispatch(feedsSlice.actions.select(props.feed.id));
    };

    return (
        <Folder
            title={props.feed.title || props.feed.url}
            selected={props.selectedId === props.feed.id}
            focus={focus}
            expanded={expanded}
            handleOnClick={handleOnClickFolder}
            handleOnBlur={handleOnBlurFolder}
            handleOnContextMenu={handleOnContextMenuFolder}>
            {renderItems(props)}
        </Folder>
    );
};

const MemoizedFeed = memo(Feed);

if (process.env.MODE === 'dev') {
    Feed.whyDidYouRender = true;
}

export default MemoizedFeed;
