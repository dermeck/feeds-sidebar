import { FolderSimple, CaretDown, CaretRight } from 'phosphor-react';

import React, { Fragment, useMemo, useRef, useState } from 'react';

import { TreeNode } from '../../../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import feedsSlice, { selectHasVisibleChildren } from '../../../../store/slices/feeds';
import { RelativeDragDropPosition } from '../../../../utils/dragdrop';
import { MouseEventButton } from '../../../../utils/types/web-api';
import { useContextMenu } from '../../../Menu/ContextMenu/useContextMenu';
import useDragDropNode from '../dragdrop/useDragDropNode';
import { clsx } from 'clsx';

interface Props {
    node: TreeNode;
    showTitle: boolean;
    nestedLevel: number;
    children: React.ReactNode;
}

const folderTreeNodeLabel = (node: TreeNode) => node.data.title ?? node.data.id;

const Folder = (props: Props) => {
    const nodeMeta = useMemo(() => ({ nodeId: props.node.data.id, nodeType: props.node.nodeType }), [props.node]);

    const [expanded, setExpanded] = useState<boolean>(true);

    const titleContainerRef = useRef<HTMLDivElement>(null);
    useContextMenu(titleContainerRef);

    const showToggleIndicator = useAppSelector((state) => selectHasVisibleChildren(state.feeds, nodeMeta));
    const selectedId = useAppSelector((state) => state.feeds.selectedNode?.nodeId);
    const dispatch = useAppDispatch();

    const {
        isDropNotAllowed,
        relativeDropPosition,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
    } = useDragDropNode(nodeMeta);

    if (!props.showTitle) {
        return <Fragment>{props.children}</Fragment>;
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.button !== MouseEventButton.leftMouseButton && e.button !== MouseEventButton.rightMouseButton) {
            return;
        }

        if (selectedId !== nodeMeta.nodeId) {
            dispatch(feedsSlice.actions.select(nodeMeta));
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.button === MouseEventButton.leftMouseButton) {
            setExpanded(!expanded);
        }
    };

    // TODO indicate if folder has unread items
    return (
        <div className="folder">
            <div
                className={clsx(
                    'folder__title-container',
                    isDropNotAllowed && 'folder__title-container--disabled',
                    selectedId === nodeMeta.nodeId && 'folder__title-container--selected',
                )}
                style={{ '--folder-nested-level': props.nestedLevel } as React.CSSProperties}
                ref={titleContainerRef}
                draggable={true}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                tabIndex={0}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}>
                <div
                    className={clsx(
                        'folder__spacer',
                        relativeDropPosition === RelativeDragDropPosition.Top && 'folder__spacer--highlight',
                    )}
                />
                <div className="folder__title-row">
                    <div className="folder__toggle-indicator">
                        {showToggleIndicator && (expanded ? <CaretDown weight="bold" /> : <CaretRight weight="bold" />)}
                    </div>
                    <FolderSimple className="folder__icon" size={20} weight="light" />
                    <label
                        className={clsx(
                            'folder__label',
                            relativeDropPosition === RelativeDragDropPosition.Middle && 'folder__label--highlight',
                        )}>
                        {folderTreeNodeLabel(props.node)}
                    </label>
                </div>
                <div
                    className={clsx(
                        'folder__spacer',
                        relativeDropPosition === RelativeDragDropPosition.Bottom && 'folder__spacer--highlight',
                    )}
                />
            </div>

            {expanded && props.children}
        </div>
    );
};

if (process.env.MODE === 'dev') {
    Folder.whyDidYouRender = true;
}

export default Folder;
