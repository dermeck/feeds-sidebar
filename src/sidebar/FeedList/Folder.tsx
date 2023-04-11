import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { FolderSimple, CaretDown, CaretRight } from 'phosphor-react';

import React, { Fragment, useState } from 'react';

import { menuWidthInPx } from '../../base-components/styled/Menu';
import { NodeMeta } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { selectHasVisibleChildren } from '../../store/slices/feeds';
import sessionSlice from '../../store/slices/session';
import { RelativeDragDropPosition } from '../../utils/dragdrop';
import useWindowDimensions from '../../utils/hooks/useWindowDimensions';
import { MouseEventButton } from '../../utils/types/web-api';
import useDragDropNode from './dragdrop/useDragDropNode';

interface FolderTitleContainerProps {
    selected: boolean;
    focus: boolean;
    disabled?: boolean;
    nestedLevel: number;
}

const FolderTitleContainer = styled.div<FolderTitleContainerProps>`
    display: flex;
    flex-direction: column;
    padding-left: ${(props) => (props.nestedLevel > 0 ? `${8 + props.nestedLevel * 15}px` : '8px')};
    margin-top: -${(props) => props.theme.spacerHeight}px;
    margin-bottom: -${(props) => props.theme.spacerHeight}px;

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
    opacity: ${(props) => (props.disabled ? 0.3 : 0.9)};
`;

interface SpacerProps {
    highlight: boolean;
}

const Spacer = styled.div<SpacerProps>`
    width: 48px;
    height: ${(props) => props.theme.spacerHeight}px;
    margin-left: ${({ theme }) => theme.toggleIndicatorSize + theme.iconRightSpacing}px;

    background-color: ${(props) => (props.highlight ? props.theme.colors.selectedItemBackgroundColor : 'inherit')};
`;

const FolderTitleRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 1px;
    padding-right: 0;
    padding-bottom: 1px;
`;

const FolderTitle = styled.label<{ highlight: boolean }>`
    overflow: hidden;
    background-color: ${(props) => (props.highlight ? props.theme.colors.selectedItemBackgroundColor : 'inherit')};
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ToggleIndicator = styled.div`
    width: ${({ theme }) => theme.toggleIndicatorSize}px;
    flex-shrink: 0; /* only shrink title */
    padding-right: ${({ theme }) => theme.iconRightSpacing}px;
    margin-bottom: -6px;
`;

const FolderIcon = styled(FolderSimple)`
    flex-shrink: 0;
    margin-top: -2px; /* align with label */
    margin-right: ${({ theme }) => theme.iconRightSpacing}px;
`;

// TODO rework props
interface Props {
    nodeMeta: NodeMeta;
    title: string;
    showTitle: boolean;
    nestedLevel: number;
    children: React.ReactNode;
}

// TODO find a more robust way to determine menu height
const contextMenuHeight = 64; // 2 menu items, each 32px

const Folder = (props: Props) => {
    const theme = useTheme();

    const [expanded, setExpanded] = useState<boolean>(true);
    const [focus, setFocus] = useState<boolean>(false); // highlight with color

    const showToggleIndicator = useAppSelector((state) => selectHasVisibleChildren(state.feeds, props.nodeMeta));
    const selectedId = useAppSelector((state) => state.feeds.selectedNode?.nodeId);
    const dispatch = useAppDispatch();

    const { height, width } = useWindowDimensions();

    const {
        isDropNotAllowed,
        relativeDropPosition,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
    } = useDragDropNode(props.nodeMeta);

    if (!props.showTitle) {
        return <Fragment>{props.children}</Fragment>;
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.button !== MouseEventButton.leftMouseButton && e.button !== MouseEventButton.rightMouseButton) {
            return;
        }

        if (e.button === MouseEventButton.leftMouseButton) {
            setExpanded(!expanded);
        }

        if (!focus) {
            setFocus(true);
        }

        if (selectedId !== props.nodeMeta.nodeId) {
            dispatch(feedsSlice.actions.select(props.nodeMeta));
        }
    };

    const handleBlur = () => {
        if (focus) {
            setFocus(false);
        }
    };

    // TODO auslagern nach ContextMenuTarget
    const handleContextMenuFolder = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();

        if (width === undefined || height === undefined) {
            console.error('Could not open context menu. Unable to determine dimensions of window.');
            return;
        }

        const x = width - e.clientX < menuWidthInPx ? width - menuWidthInPx : e.clientX;
        const y = height - e.clientY < contextMenuHeight ? height - contextMenuHeight : e.clientY;

        dispatch(sessionSlice.actions.showContextMenu({ x, y }));

        if (selectedId !== props.nodeMeta.nodeId) {
            dispatch(feedsSlice.actions.select(props.nodeMeta));
        }
    };

    // TODO indicate if folder has unread items
    return (
        <Fragment>
            <FolderTitleContainer
                theme={theme}
                disabled={isDropNotAllowed}
                focus={focus}
                nestedLevel={props.nestedLevel}
                selected={selectedId === props.nodeMeta.nodeId}
                draggable={true}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                tabIndex={0}
                onMouseDown={handleMouseDown}
                onBlur={handleBlur}
                onContextMenu={handleContextMenuFolder}>
                <Spacer theme={theme} highlight={relativeDropPosition === RelativeDragDropPosition.Top} />
                <FolderTitleRow>
                    <ToggleIndicator theme={theme}>
                        {showToggleIndicator &&
                            (expanded ? (
                                <CaretDown size={theme.toggleIndicatorSize} weight="bold" />
                            ) : (
                                <CaretRight size={theme.toggleIndicatorSize} weight="bold" />
                            ))}
                    </ToggleIndicator>
                    <FolderIcon theme={theme} size={theme.folderIconSize} weight="light" />
                    <FolderTitle highlight={relativeDropPosition === RelativeDragDropPosition.Middle}>
                        {props.title}
                    </FolderTitle>
                </FolderTitleRow>
                <Spacer theme={theme} highlight={relativeDropPosition === RelativeDragDropPosition.Bottom} />
            </FolderTitleContainer>

            {expanded && props.children}
        </Fragment>
    );
};

if (process.env.MODE === 'dev') {
    Folder.whyDidYouRender = true;
}

export default Folder;
