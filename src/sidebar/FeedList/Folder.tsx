import styled from '@emotion/styled';
import { FolderSimple, CaretDown, CaretRight } from 'phosphor-react';

import React, { Fragment, useState } from 'react';

import FolderEdit from './FolderEdit';

interface FolderTitleContainerProps {
    selected: boolean;
    focus: boolean;
    disabled: boolean;
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
    margin-bottom: -6px;
`;

const FolderIcon = styled(FolderSimple)`
    flex-shrink: 0;
    margin-top: -2px; /* align with label */
    margin-right: 4px;
`;

interface Props {
    title?: string;
    showTitle: boolean;
    nestedLevel: number;
    children?: React.ReactNode;
    selected?: boolean;
    focus?: boolean;
    expanded?: boolean;
    editing?: boolean;
    handleOnClick?: () => void;
    handleOnBlur?: () => void;
    handleOnContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onEditComplete?: (x: string) => void;
    onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
    validDropTarget: boolean;
    onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
}

const Folder = (props: Props) => {
    const [draggedOver, setDraggedOver] = useState(false);

    if (!props.showTitle) {
        return <Fragment>{props.children}</Fragment>;
    }

    // TODO indicate if folder has unread items
    return (
        <Fragment>
            <FolderTitleContainer
                draggable={true}
                onDragStart={(event: React.DragEvent<HTMLDivElement>) => {
                    if (props.onDragStart) {
                        props.onDragStart(event);
                    }
                }}
                onDragOver={(event: React.DragEvent<HTMLDivElement>) => {
                    // TODO determine drop position (top, center, bottom) based on drop target bounding box and drag position
                    // use that information (local state) to highlight (line, highlight label) and use it fro drop effect (before, insert, after)
                    if (props.validDropTarget) {
                        setDraggedOver(true);
                        event.preventDefault();
                    }
                }}
                onDragLeave={() => {
                    if (props.validDropTarget) {
                        setDraggedOver(false);
                    }
                }}
                onDrop={(event: React.DragEvent<HTMLDivElement>) => {
                    setDraggedOver(false);
                    if (props.onDrop) {
                        props.onDrop(event);
                    }
                }}
                onDragEnd={props.onDragEnd}
                disabled={!props.validDropTarget && !props.editing}
                nestedLevel={props.nestedLevel}
                tabIndex={0}
                selected={!!props.selected}
                focus={!!props.focus}
                onClick={props.handleOnClick}
                onBlur={props.handleOnBlur}
                onContextMenu={props.handleOnContextMenu}>
                <ToggleIndicator>
                    {props.expanded ? <CaretDown size={12} weight="bold" /> : <CaretRight size={12} weight="bold" />}
                </ToggleIndicator>
                <FolderIcon size={20} weight="light" />
                {props.editing ? (
                    <FolderEdit
                        initialValue={props.title ?? ''}
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
