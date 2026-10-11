import { CaretDown, CaretRight, DotsSixVertical, FolderSimple, Rss, YoutubeLogo } from '@phosphor-icons/react';

import React, { useRef, useState } from 'react';
import { Button, Menu, MenuItem, Popover, TreeItemContent } from 'react-aria-components';
import { clsx } from 'clsx';

import { NodeType } from '../../../model/feeds';
import { isYoutubeUrl } from '../../../services/youtube/videoUrl';
import { useAppDispatch } from '../../../store/hooks';
import feedsSlice, { TreeViewItem } from '../../../store/slices/feeds';

type FolderTreeItemProps = {
    item: TreeViewItem;
};

export const FolderTreeItem = ({ item }: FolderTreeItemProps) => {
    const dispatch = useAppDispatch();
    const node = { nodeId: item.id, nodeType: item.nodeType };

    const rowRef = useRef<HTMLDivElement>(null);
    const [menuOffset, setMenuOffset] = useState<{ top: number; left: number } | undefined>(undefined);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();
        setMenuOffset({ top: e.clientY - rect.bottom, left: e.clientX - rect.left });
    };

    return (
        <TreeItemContent>
            {({ hasChildItems, isExpanded }) => (
                <>
                    <div ref={rowRef} className="folder__title-container" onContextMenu={handleContextMenu}>
                        <div className="folder__title-row">
                            <Button
                                slot="chevron"
                                className={clsx(
                                    'folder__toggle-indicator',
                                    !hasChildItems && 'folder__toglle-indicator--hidden',
                                )}
                            >
                                {isExpanded ? <CaretDown weight="bold" /> : <CaretRight weight="bold" />}
                            </Button>
                            {item.nodeType === NodeType.Folder ? (
                                <FolderSimple className="folder__icon" size={20} weight="light" />
                            ) : isYoutubeUrl(item.id) ? (
                                <YoutubeLogo className="folder__icon" size={20} weight="light" />
                            ) : (
                                <Rss className="folder__icon" size={20} weight="light" />
                            )}
                            <label className="folder__label">{item.title}</label>
                            <Button slot="drag" className="folder__drag-handle">
                                <DotsSixVertical size={14} />
                            </Button>
                        </div>
                    </div>
                    <Popover
                        className="menu"
                        isOpen={menuOffset !== undefined}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) {
                                setMenuOffset(undefined);
                            }
                        }}
                        triggerRef={rowRef}
                        placement="bottom start"
                        offset={menuOffset?.top}
                        crossOffset={menuOffset?.left}>
                        <Menu className="menu-list" aria-label={`${item.title} actions`}>
                            <MenuItem
                                className="menu-item"
                                onAction={() => {
                                    setMenuOffset(undefined);

                                    if (
                                        window.confirm(
                                            'Do you want to delete the selected folder and all its contents?',
                                        )
                                    ) {
                                        dispatch(feedsSlice.actions.deleteNode(node));
                                    }
                                }}>
                                Delete
                            </MenuItem>
                            <MenuItem
                                className="menu-item"
                                onAction={() => {
                                    setMenuOffset(undefined);
                                    dispatch(feedsSlice.actions.markNodeAsRead(node));
                                }}>
                                Mark as Read
                            </MenuItem>
                        </Menu>
                    </Popover>
                </>
            )}
        </TreeItemContent>
    );
};
