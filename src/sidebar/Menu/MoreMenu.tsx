/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';

import { FunctionComponent, useRef } from 'react';

import { MenuContainer, MenuList } from '../../base-components';
import { Divider } from '../../base-components/styled/Divider';
import opmlExport from '../../services/export';
import { readOpmlFile } from '../../services/import';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import feedsSlice, { fetchFeedsCommand } from '../../store/slices/feeds';
import sessionSlice, { Point, View } from '../../store/slices/session';
import MenuItem from './MenuItem';

const ImportInput = styled.input`
    /* do not take up any space */
    display: block;
    height: 0;

    visibility: hidden;
`;

interface Props {
    anchorPoint: Point;
}

const MoreMenu: FunctionComponent<Props> = (props: Props) => {
    const inputFileRef = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const feeds = useAppSelector((state) => state.feeds);

    return (
        <MenuContainer anchorTop={props.anchorPoint.y} anchorLeft={props.anchorPoint.x}>
            <MenuList>
                <MenuItem icon="plus" onMouseDown={() => dispatch(sessionSlice.actions.changeView(View.subscribe))}>
                    Add New Feeds
                </MenuItem>

                <MenuItem icon="folder-plus" onMouseDown={() => dispatch(sessionSlice.actions.newFolder())}>
                    New Folder
                </MenuItem>

                <MenuItem icon="check-square" onMouseDown={() => dispatch(feedsSlice.actions.markAllAsRead())}>
                    Mark All Read
                </MenuItem>

                <Divider />

                <MenuItem icon="export" onMouseDown={() => opmlExport(feeds.folders, feeds.feeds)}>
                    Export
                </MenuItem>

                <MenuItem
                    icon="import"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        inputFileRef.current?.click();
                    }}>
                    Import
                </MenuItem>
            </MenuList>
            <ImportInput
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
        </MenuContainer>
    );
};

export default MoreMenu;
