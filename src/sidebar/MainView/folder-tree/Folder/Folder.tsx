import { FolderSimple, CaretDown, CaretRight } from '@phosphor-icons/react';

import React, { useMemo, useRef, useState } from 'react';

import { TreeNode } from '../../../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import feedsSlice, { selectHasVisibleChildren } from '../../../../store/slices/feeds';
import { MouseEventButton } from '../../../../utils/types/web-api';
import { useContextMenu } from '../../../Menu/ContextMenu/useContextMenu';
import { DragDropContainer } from '../dragdrop/container/DragDropContainer';
import { clsx } from 'clsx';

type FolderProps = {
    node: TreeNode;
    nestedLevel: number;
    children: React.ReactNode;
};

const folderTreeNodeLabel = (node: TreeNode) => node.data.title ?? node.data.id;

export const Folder = ({ node, nestedLevel, children }: FolderProps) => {
    const nodeMeta = useMemo(() => ({ nodeId: node.data.id, nodeType: node.nodeType }), [node]);

    const [expanded, setExpanded] = useState<boolean>(true);

    const titleContainerRef = useRef<HTMLDivElement>(null);
    useContextMenu(titleContainerRef);

    const showToggleIndicator = useAppSelector((state) => selectHasVisibleChildren(state.feeds, nodeMeta));
    const selectedId = useAppSelector((state) => state.feeds.selectedNode?.nodeId);
    const dispatch = useAppDispatch();

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
            <DragDropContainer
                className={clsx(
                    'folder__title-container',
                    selectedId === nodeMeta.nodeId && 'folder__title-container--selected',
                )}
                nodeMeta={nodeMeta}
                selected={selectedId === nodeMeta.nodeId}
                style={{ '--folder-nested-level': nestedLevel } as React.CSSProperties}
                ref={titleContainerRef}
                tabIndex={0}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}>
                <div className="folder__title-row">
                    <div className="folder__toggle-indicator">
                        {showToggleIndicator && (expanded ? <CaretDown weight="bold" /> : <CaretRight weight="bold" />)}
                    </div>
                    <FolderSimple className="folder__icon" size={20} weight="light" />
                    <label className="folder__label">{folderTreeNodeLabel(node)}</label>
                </div>
            </DragDropContainer>

            {expanded && children}
        </div>
    );
};
