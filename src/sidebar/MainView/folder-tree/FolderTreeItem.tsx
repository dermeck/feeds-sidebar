import { CaretDown, CaretRight, DotsSixVertical, FolderSimple, Rss, YoutubeLogo } from '@phosphor-icons/react';

import React from 'react';
import { Button, TreeItemContent } from 'react-aria-components';
import { clsx } from 'clsx';

import { NodeType } from '../../../model/feeds';
import { isYoutubeUrl } from '../../../services/youtube/videoUrl';
import { useAppDispatch } from '../../../store/hooks';
import feedsSlice, { TreeViewItem } from '../../../store/slices/feeds';
import sessionSlice from '../../../store/slices/session';
import useWindowDimensions from '../../../utils/hooks/useWindowDimensions';
import { menuPosition } from '../../Menu/ContextMenu/menuPosition';

type FolderTreeItemProps = {
    item: TreeViewItem;
};

export const FolderTreeItem = ({ item }: FolderTreeItemProps) => {
    const dispatch = useAppDispatch();
    const { width, height } = useWindowDimensions();

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();

        const position = menuPosition(e, width, height);

        if (position === undefined) {
            return;
        }

        dispatch(feedsSlice.actions.select({ nodeId: item.id, nodeType: item.nodeType }));
        dispatch(sessionSlice.actions.showContextMenu(position));
    };

    return (
        <TreeItemContent>
            {({ hasChildItems, isExpanded }) => (
                <div className="folder__title-container" onContextMenu={handleContextMenu}>
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
            )}
        </TreeItemContent>
    );
};
