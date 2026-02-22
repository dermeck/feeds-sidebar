import React, { useRef } from 'react';

import opmlExport from '../../../services/export';
import { readOpmlFile } from '../../../services/import';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import feedsSlice, { fetchFeedsCommand, selectFeeds, selectFolders } from '../../../store/slices/feeds';
import sessionSlice, { Point } from '../../../store/slices/session';
import { MenuListItem } from '../MenuListItem/MenuItem';
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
        <div
            className="menu__container"
            style={
                {
                    '--menu-anchor-left': `${props.anchorPoint.x}px`,
                    '--menu-anchor-top': `${props.anchorPoint.y}px`,
                } as React.CSSProperties
            }>
            <ul className="menu__list">
                <MenuListItem icon="plus" onMouseDown={() => props.changeView(View.subscribe)}>
                    Add New Feeds
                </MenuListItem>

                <MenuListItem icon="folder-plus" onMouseDown={() => dispatch(sessionSlice.actions.newFolder())}>
                    New Folder
                </MenuListItem>

                <MenuListItem icon="check-square" onMouseDown={() => dispatch(feedsSlice.actions.markAllAsRead())}>
                    Mark All Read
                </MenuListItem>

                <MenuListItem
                    icon="stethoscope"
                    onMouseDown={() => {
                        props.changeView(View.diagnosis);
                        dispatch(sessionSlice.actions.hideMenu());
                    }}>
                    Diagnosis
                </MenuListItem>

                <hr className="menu__divider" />

                <MenuListItem icon="export" onMouseDown={() => opmlExport(folders, feeds)}>
                    Export
                </MenuListItem>

                <MenuListItem
                    icon="import"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        inputFileRef.current?.click();
                    }}>
                    Import
                </MenuListItem>
            </ul>
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
        </div>
    );
};
