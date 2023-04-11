import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { FolderSimple, CaretDown, CaretRight } from 'phosphor-react';

import React, { Fragment, useState } from 'react';

import { NodeMeta } from '../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { selectHasVisibleChildren } from '../../store/slices/feeds';
import { RelativeDragDropPosition } from '../../utils/dragdrop';
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
    onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Folder = (props: Props) => {
    const theme = useTheme();

    const [expanded, setExpanded] = useState<boolean>(true);
    const [focus, setFocus] = useState<boolean>(false); // highlight with color

    const showToggleIndicator = useAppSelector((state) => selectHasVisibleChildren(state.feeds, props.nodeMeta));
    const selectedId = useAppSelector((state) => state.feeds.selectedNode?.nodeId); // memo oder außen selecten und als prop
    const dispatch = useAppDispatch();

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

    const handleClick = () => {
        // TODO refactor to use MouseDown?
        setExpanded(!expanded);
        if (!focus) {
            setFocus(true);
        }

        if (props.nodeMeta !== undefined) {
            dispatch(feedsSlice.actions.select(props.nodeMeta));
        }
    };

    const handleBlur = () => {
        if (focus) {
            setFocus(false);
        }
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        props.onContextMenu(e); // TODO we might not need this
        if (!focus) {
            setFocus(true);
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
                onClick={handleClick}
                onBlur={handleBlur}
                onContextMenu={handleContextMenu}>
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
