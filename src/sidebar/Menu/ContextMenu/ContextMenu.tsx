import React from 'react';

import { Menu } from '../../../base-components/Menu/Menu';
import { MenuItem } from '../../../base-components/Menu/MenuItem';
import { MenuList } from '../../../base-components/Menu/MenuList';
import { useAppDispatch } from '../../../store/hooks';
import feedsSlice from '../../../store/slices/feeds';
import sessionSlice, { Point } from '../../../store/slices/session';

interface Props {
    anchorPoint: Point;
}

export const ContextMenu = (props: Props) => {
    const dispatch = useAppDispatch();

    return (
        <Menu anchorPoint={props.anchorPoint}>
            <MenuList>
                <MenuItem
                    onMouseDown={() => {
                        dispatch(sessionSlice.actions.hideMenu());
                        window.confirm('Do you want to delete the selected folder and all its contents?')
                            ? dispatch(feedsSlice.actions.deleteSelectedNode())
                            : undefined;
                    }}>
                    Delete
                </MenuItem>
                <MenuItem onMouseDown={() => dispatch(feedsSlice.actions.markSelectedNodeAsRead())}>
                    Mark as Read
                </MenuItem>
            </MenuList>
        </Menu>
    );
};