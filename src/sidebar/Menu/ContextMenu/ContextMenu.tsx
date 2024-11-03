import React from 'react';

import { useAppDispatch } from '../../../store/hooks';
import feedsSlice from '../../../store/slices/feeds';
import sessionSlice, { Point } from '../../../store/slices/session';
import { MenuListItem } from '../MenuListItem/MenuItem';

interface Props {
    anchorPoint: Point;
}

export const ContextMenu = (props: Props) => {
    const dispatch = useAppDispatch();

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
                <MenuListItem
                    onMouseDown={() => {
                        dispatch(sessionSlice.actions.hideMenu());
                        window.confirm('Do you want to delete the selected folder and all its contents?')
                            ? dispatch(feedsSlice.actions.deleteSelectedNode())
                            : undefined;
                    }}>
                    Delete
                </MenuListItem>
                <MenuListItem onMouseDown={() => dispatch(feedsSlice.actions.markSelectedNodeAsRead())}>
                    Mark as Read
                </MenuListItem>
            </ul>
        </div>
    );
};
