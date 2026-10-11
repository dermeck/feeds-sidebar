import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import sessionSlice from '../../store/slices/session';
import { MoreMenu } from './MoreMenu/MoreMenu';
import { View } from '../App';
import { clsx } from 'clsx';

const Menu = ({ changeView }: { changeView: (value: View) => void }) => {
    const context = useAppSelector((state) => state.session.menuContext);
    const visible = useAppSelector((state) => state.session.menuVisible);

    const dispatch = useAppDispatch();

    if (context === undefined) {
        return null;
    }

    // TODO mr refactor the whole menu thing to not use redux / use local state instead like 'changeView'
    return (
        <div
            className={clsx('menu__backdrop', !visible && 'menu__backdrop--hidden')}
            onMouseDown={() => dispatch(sessionSlice.actions.hideMenu())}
            onContextMenu={(e) => e.preventDefault()}>
            <MoreMenu anchorPoint={context.anchorPoint} changeView={changeView} />
        </div>
    );
};

export default Menu;
