import styled from '@emotion/styled';
import { FolderSimple, CaretDown, CaretRight } from 'phosphor-react';

import React, { Fragment, FunctionComponent, memo, useEffect, useState } from 'react';

import { menuWidthInPx } from '../../base-components/styled/Menu';
import { Feed as FeedType, FeedItem as FeedItemType } from '../../model/feeds';
import { useAppDispatch } from '../../store/hooks';
import feedsSlice from '../../store/slices/feeds';
import sessionSlice from '../../store/slices/session';
import useWindowDimensions from '../../utils/hooks/useWindowDimensions';
import FeedItem from './FeedItem';

const FeedContainer = styled.ul`
    padding-left: 0;
    margin: 0 0 0.2rem 0;
    opacity: 0.9;
`;

interface FeedTitleContainerProps {
    selected: boolean;
    focus: boolean;
}

const FeedTitleContainer = styled.div<FeedTitleContainerProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 2px 0 3px 8px;

    background-color: ${(props) =>
        props.selected
            ? props.focus
                ? props.theme.colors.selectedItemBackgroundColor
                : props.theme.colors.selectedItemNoFocusBackgroundColor
            : 'inherit'};
    color: ${(props) =>
        props.selected
            ? props.focus
                ? props.theme.colors.selectedItemTextColor
                : props.theme.colors.selectedItemNoFocusTextColor
            : 'inherit'};
    opacity: 0.9;
`;

const FeedTitle = styled.label`
    overflow: hidden;
    margin-left: 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ToggleIndicator = styled.div`
    margin-right: 4px;
    margin-bottom: -6px;
`;

const FeedFolderIcon = styled(FolderSimple)`
    flex-shrink: 0;
`;

interface Props {
    feed: FeedType;
    selectedId: string;
    showTitle: boolean;
    filterString: string;
}

const renderItem = (item: FeedItemType, props: Props) => (
    <FeedItem key={item.id + item.title} feedId={props.feed.id} item={item} indented={props.showTitle} />
);

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

    const handleOnContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
        <Fragment>
            {props.showTitle && (
                <FeedTitleContainer
                    tabIndex={0}
                    selected={props.selectedId === props.feed.id}
                    focus={focus}
                    onClick={() => {
                        setExpanded(!expanded);
                        setFocus(true);
                        handleFeedTitleClick();
                    }}
                    onBlur={() => {
                        setFocus(false);
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        handleOnContextMenu(e);
                    }}>
                    <ToggleIndicator>
                        {expanded ? <CaretDown size={12} weight="bold" /> : <CaretRight size={12} weight="bold" />}
                    </ToggleIndicator>
                    <FeedFolderIcon size={20} />
                    <FeedTitle>{props.feed.title || props.feed.url}</FeedTitle>
                </FeedTitleContainer>
            )}

            {(expanded || !props.showTitle) && props.feed.items.some((x) => !x.isRead || x.id === props.selectedId) && (
                <FeedContainer>
                    {props.feed.items.map(
                        (item) =>
                            item.title?.toLowerCase().includes(props.filterString.toLowerCase()) &&
                            renderItem(item, props),
                    )}
                </FeedContainer>
            )}
        </Fragment>
    );
};

const MemoizedFeed = memo(Feed);

if (process.env.MODE === 'dev') {
    Feed.whyDidYouRender = true;
}

export default MemoizedFeed;
