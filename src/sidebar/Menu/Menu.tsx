/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FunctionComponent, useEffect, useState } from 'react';

import { MenuBackdrop } from '../../components/styled';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import sessionSlice from '../../store/slices/session';
import ContextMenu from './ContextMenu';

const Menu: FunctionComponent = () => {
    const context = useAppSelector((state) => state.session.menuContext);

    const dispatch = useAppDispatch();

    const hideMenu = () => {
        dispatch(sessionSlice.actions.hideMenu());
    };

    if (context === undefined) {
        return null;
    }

    return (
        <MenuBackdrop onClick={hideMenu} onMouseDown={hideMenu} onContextMenu={(e) => e.preventDefault()}>
            <ContextMenu anchorPoint={context.anchorPoint} />
        </MenuBackdrop>
    );
};

export default Menu;
