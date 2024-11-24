import { FolderSimple, CaretDown, CaretRight } from '@phosphor-icons/react';

import React, { useMemo, useRef, useState } from 'react';

import { TreeNode } from '../../../../model/feeds';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import feedsSlice, { selectHasVisibleChildren } from '../../../../store/slices/feeds';
import { MouseEventButton } from '../../../../utils/types/web-api';
import { useContextMenu } from '../../../Menu/ContextMenu/useContextMenu';
import { DragDropContainer } from '../dragdrop/container/DragDropContainer';
import { clsx } from 'clsx';

interface Props {
    node: TreeNode;
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
                style={{ '--folder-nested-level': props.nestedLevel } as React.CSSProperties}
                ref={titleContainerRef}
                tabIndex={0}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}>
                <div className="folder__title-row">
                    <div className="folder__toggle-indicator">
                        {showToggleIndicator && (expanded ? <CaretDown weight="bold" /> : <CaretRight weight="bold" />)}
                    </div>
                    <FolderSimple className="folder__icon" size={20} weight="light" />
                    <label className="folder__label">{folderTreeNodeLabel(props.node)}</label>
                </div>
            </DragDropContainer>

            {expanded && props.children}
        </div>
    );
};

if (process.env.MODE === 'dev') {
    Folder.whyDidYouRender = true;
}

export default Folder;
