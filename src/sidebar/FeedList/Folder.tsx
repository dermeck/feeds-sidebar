import styled from '@emotion/styled';
import { FolderSimple, CaretDown, CaretRight } from 'phosphor-react';

import React, { Fragment, useState } from 'react';

import { relativeDragDropPosition } from '../../utils/dragdrop';
import FolderEdit from './FolderEdit';

interface FolderTitleContainerProps {
    selected: boolean;
    focus: boolean;
    disabled?: boolean;
    nestedLevel: number;
}

const FolderTitleContainer = styled.div<FolderTitleContainerProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 3px;
    padding-right: o;
    padding-bottom: 3px;
    padding-left: ${(props) => (props.nestedLevel > 0 ? `${8 + props.nestedLevel * 15}px` : '8px')};

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

const FolderTitle = styled.label<{ highlight: boolean }>`
    overflow: hidden;
    background-color: ${(props) => (props.highlight ? props.theme.colors.selectedItemBackgroundColor : 'inherit')};
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ToggleIndicator = styled.div`
    margin-right: 4px;
    margin-top: -6px;
    // margin-bottom: -4px // TODO mit border +2px;
`;

const FolderIcon = styled(FolderSimple)`
    flex-shrink: 0;
    margin-top: -2px; /* align with label */ // TODO border berücksichtigen
    margin-right: 4px;
    // border-top: 2px solid transparent; // TODO color bei drag
    // border-bottom: 2px solid transparent; // TODO color bei drag
`;

interface Props {
    id?: string;
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
    onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const Folder = (props: Props) => {
    const [draggedOver, setDraggedOver] = useState(false);

    if (!props.showTitle) {
        return <Fragment>{props.children}</Fragment>;
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (props.onDragStart) {
            props.onDragStart(event);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        const invalidDroptTargets = event.dataTransfer.getData('invalidDroptTargets').split(';');

        if (invalidDroptTargets.find((x) => x === props.id)) {
            return;
        }

        // TODO determine drop position (top, center, bottom) based on drop target bounding box and drag position
        // use that information (local state) to highlight (line, highlight label) and use it fro drop effect (before, insert, after)
        if (!props.disabled) {
            setDraggedOver(true);
            console.log(relativeDragDropPosition(event));
            event.preventDefault();
        }
    };

    const handleDragLeave = () => {
        if (draggedOver) {
            setDraggedOver(false);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        const invalidDroptTargets = event.dataTransfer.getData('invalidDroptTargets').split(';');

        if (invalidDroptTargets.find((x) => x === props.id)) {
            return;
        }

        setDraggedOver(false);
        if (props.onDrop) {
            props.onDrop(event);
        }
    };

    // TODO indicate if folder has unread items
    return (
        <Fragment>
            <FolderTitleContainer
                draggable={true}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={props.onDragEnd}
                disabled={props.disabled}
                nestedLevel={props.nestedLevel}
                tabIndex={0}
                selected={!!props.selected}
                focus={!!props.focus}
                onClick={props.onClick}
                onBlur={props.onBlur}
                onContextMenu={props.onContextMenu}>
                <ToggleIndicator>
                    {props.expanded ? <CaretDown size={12} weight="bold" /> : <CaretRight size={12} weight="bold" />}
                </ToggleIndicator>
                <FolderIcon size={20} weight="light" />
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
                    <FolderTitle highlight={draggedOver}>{props.title}</FolderTitle>
                )}
            </FolderTitleContainer>

            {props.expanded && props.children}
        </Fragment>
    );
};

if (process.env.MODE === 'dev') {
    Folder.whyDidYouRender = true;
}

export default Folder;
