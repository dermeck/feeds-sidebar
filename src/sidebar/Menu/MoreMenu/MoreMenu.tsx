import {
    CheckSquare,
    DownloadSimple,
    FolderSimplePlus,
    GearSix,
    Plus,
    Stethoscope,
    UploadSimple,
} from '@phosphor-icons/react';
import React, { useRef } from 'react';

import { Menu } from '../../../base-components/Menu/Menu';
import { MenuDivider } from '../../../base-components/Menu/MenuDivider';
import { MenuItem } from '../../../base-components/Menu/MenuItem';
import { MenuList } from '../../../base-components/Menu/MenuList';
import opmlExport from '../../../services/export';
import { readOpmlFile } from '../../../services/import';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import feedsSlice, { fetchFeedsCommand, selectFeeds, selectFolders } from '../../../store/slices/feeds';
import sessionSlice, { Point } from '../../../store/slices/session';
import { View } from '../../App';

interface Props {
    anchorPoint: Point;
    changeView: (value: View) => void;
}

export const MoreMenu = (props: Props) => {
    const inputFileRef = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => selectFeeds(state.feeds));
    const folders = useAppSelector((state) => selectFolders(state.feeds));

    return (
        <Menu anchorPoint={props.anchorPoint}>
            <MenuList>
                <MenuItem icon={<Plus size={18} />} onMouseDown={() => props.changeView(View.subscribe)}>
                    Add New Feeds
                </MenuItem>

                <MenuItem
                    icon={<FolderSimplePlus size={18} />}
                    onMouseDown={() => dispatch(sessionSlice.actions.newFolder())}>
                    New Folder
                </MenuItem>

                <MenuItem
                    icon={<CheckSquare size={18} weight="bold" />}
                    onMouseDown={() => dispatch(feedsSlice.actions.markAllAsRead())}>
                    Mark All Read
                </MenuItem>

                <MenuItem
                    icon={<Stethoscope size={18} />}
                    onMouseDown={() => {
                        props.changeView(View.diagnosis);
                        dispatch(sessionSlice.actions.hideMenu());
                    }}>
                    Diagnosis
                </MenuItem>

                <MenuItem
                    icon={<GearSix size={18} />}
                    onMouseDown={() => {
                        if (!process.env.STAND_ALONE) {
                            browser.runtime.openOptionsPage();
                        }
                        dispatch(sessionSlice.actions.hideMenu());
                    }}>
                    Settings
                </MenuItem>

                <MenuDivider />

                <MenuItem icon={<UploadSimple size={18} weight="bold" />} onMouseDown={() => opmlExport(folders, feeds)}>
                    Export
                </MenuItem>

                <MenuItem
                    icon={<DownloadSimple size={18} weight="bold" />}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        inputFileRef.current?.click();
                    }}>
                    Import
                </MenuItem>
            </MenuList>
            <input
                className="more-menu__import-input"
                aria-label="import-input"
                aria-hidden="true"
                ref={inputFileRef}
                type="file"
                accept=".xml,.opml"
                onChange={async (e) => {
                    if (e.target.files === null) {
                        return;
                    }

                    const file = e.target.files[0];
                    const fileContent = await readOpmlFile(file);
                    if (fileContent === undefined) {
                        alert(`An error occured while parsing file "${file.name}".`);
                    } else {
                        dispatch(fetchFeedsCommand(fileContent.feeds.map((f) => f.id)));
                        if (fileContent.folders.length > 1) {
                            dispatch(feedsSlice.actions.updateFeeds(fileContent.feeds)); // ensure referenced feeds exist before folders are created
                            dispatch(feedsSlice.actions.replaceFolders(fileContent.folders));
                        }
                    }

                    dispatch(sessionSlice.actions.hideMenu());
                }}
            />
        </Menu>
    );
};