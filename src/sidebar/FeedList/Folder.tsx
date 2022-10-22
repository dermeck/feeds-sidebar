import styled from '@emotion/styled';
import { FolderSimple, CaretDown, CaretRight } from 'phosphor-react';

import React, { Fragment, useState } from 'react';

import { NodeMeta, NodeType } from '../../model/feeds';
import { useAppSelector } from '../../store/hooks';
import { selectHasVisibleChildren } from '../../store/slices/feeds';
import { RelativeDragDropPosition, relativeDragDropPosition } from '../../utils/dragdrop';
import FolderEdit from './FolderEdit';

const spacerHeight = 2;
const toogleIndicatorSize = 12;
const folderIconSize = 20;
const iconRightSpacing = 4;

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
    margin-top: -${spacerHeight}px;
    margin-bottom: -${spacerHeight}px;

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
    height: ${spacerHeight}px;
    margin-left: ${toogleIndicatorSize + iconRightSpacing}px;

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
    width: ${toogleIndicatorSize}px;
    padding-right: ${iconRightSpacing}px;
    margin-bottom: -6px;
`;

const FolderIcon = styled(FolderSimple)`
    flex-shrink: 0;
    margin-top: -2px; /* align with label */
    margin-right: ${iconRightSpacing}px;
`;

interface Props {
    id?: string; // TODO maybe extract the Folder editing part into a separate component and make this and other props non-optional
    nodeType: NodeType; // TODO use NodeMeta?
    title?: string;
    showTitle: boolean;
    nestedLevel: number;
    children?: React.ReactNode;
    selected?: boolean;
    focus?: boolean;
    expanded?: boolean;
    editing?: boolean;
    onClick?: () => void;
    onBlur?: () => void;
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onEditComplete?: (x: string) => void;
    onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
    disabled?: boolean;
    onDrop?: (event: React.DragEvent<HTMLDivElement>, relativeDropPosition: RelativeDragDropPosition) => void;
}

const Folder = (props: Props) => {
    // only use this for UI rendering effects (insert/before/after indicator)
    const [relativeDropPosition, setRelativDropPosition] = useState<RelativeDragDropPosition | undefined>(undefined);

    const showToggleIndicator = useAppSelector((state) =>
        selectHasVisibleChildren(state.feeds, props.id, props.nodeType),
    );

    if (!props.showTitle) {
        return <Fragment>{props.children}</Fragment>;
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (props.onDragStart) {
            props.onDragStart(event);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        if (event.dataTransfer.getData('draggedNodeMeta') === '') {
            // if drag over happens very fast this might not be set properly
            return;
        }

        const invalidDroptTargets = event.dataTransfer.getData('invalidDroptTargets').split(';');

        if (invalidDroptTargets.find((x) => x === props.id)) {
            return;
        }

        const dragged: NodeMeta = JSON.parse(event.dataTransfer.getData('draggedNodeMeta'));

        if (!props.disabled) {
            setRelativDropPosition(calculateRelativeDragDropPosition(dragged.nodeType, props.nodeType, event));

            event.preventDefault();
        }
    };

    const handleDragLeave = () => {
        if (relativeDropPosition !== undefined) {
            setRelativDropPosition(undefined);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        const invalidDroptTargets = event.dataTransfer.getData('invalidDroptTargets').split(';');

        if (invalidDroptTargets.find((x) => x === props.id)) {
            return;
        }

        const dragged: NodeMeta = JSON.parse(event.dataTransfer.getData('draggedNodeMeta'));

        if (props.onDrop) {
            // recalculate here, don't rely on local state set in handleDragover
            // handleDragover is dependend on props.disabled which depends on global store so there can be timing issues
            // (local) relativeDropPosition can be undefined if drag/drop happens very fast
            const relativeDropPosition = calculateRelativeDragDropPosition(dragged.nodeType, props.nodeType, event);

            if (relativeDropPosition === undefined) {
                throw new Error('Illegal state: relativeDropPosition must be definend when handleDrop is called.');
            }

            props.onDrop(event, relativeDropPosition);
        }

        setRelativDropPosition(undefined);
    };

    const calculateRelativeDragDropPosition = (
        draggedNodeType: NodeType,
        targetNodeType: NodeType,
        event: React.DragEvent<HTMLDivElement>,
    ) => {
        let value = undefined;
        if (draggedNodeType === NodeType.Feed && targetNodeType === NodeType.Folder) {
            // feeds can only be inserted into folders
            value = RelativeDragDropPosition.Middle;
        } else if (draggedNodeType === NodeType.Feed && targetNodeType === NodeType.Feed) {
            // feeds can only be sorted
            value = relativeDragDropPosition(event, 0.5);
        } else if (draggedNodeType === NodeType.Folder && targetNodeType === NodeType.Folder) {
            value = relativeDragDropPosition(event, 0.15);
        } else {
            throw new Error(`${draggedNodeType} can not be dropped on ${targetNodeType}.`);
        }
        return value;
    };

    // TODO indicate if folder has unread items
    return (
        <Fragment>
            <FolderTitleContainer
                disabled={props.disabled}
                focus={!!props.focus}
                nestedLevel={props.nestedLevel}
                selected={!!props.selected}
                draggable={true}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={props.onDragEnd}
                tabIndex={0}
                onClick={props.onClick}
                onBlur={props.onBlur}
                onContextMenu={props.onContextMenu}>
                <Spacer highlight={relativeDropPosition === RelativeDragDropPosition.Top} />
                <FolderTitleRow>
                    <ToggleIndicator>
                        {showToggleIndicator &&
                            (props.expanded ? (
                                <CaretDown size={toogleIndicatorSize} weight="bold" />
                            ) : (
                                <CaretRight size={toogleIndicatorSize} weight="bold" />
                            ))}
                    </ToggleIndicator>
                    <FolderIcon size={folderIconSize} weight="light" />
                    {props.editing ? (
                        <FolderEdit
                            initialValue={props.title ?? 'New Folder'}
                            onEditComplete={(value) => {
                                if (props.onEditComplete === undefined) {
                                    throw new Error('onEditComplete is not defined.');
                                }
                                props.onEditComplete(value);
                            }}
                        />
                    ) : (
                        <FolderTitle highlight={relativeDropPosition === RelativeDragDropPosition.Middle}>
                            {props.title}
                        </FolderTitle>
                    )}
                </FolderTitleRow>
                <Spacer highlight={relativeDropPosition === RelativeDragDropPosition.Bottom} />
            </FolderTitleContainer>

            {props.expanded && props.children}
        </Fragment>
    );
};

if (process.env.MODE === 'dev') {
    Folder.whyDidYouRender = true;
}

export default Folder;
