import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import sessionSlice, { MenuContext, MenuType } from '../../store/slices/session';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import { ContextMenu } from './ContextMenu/ContextMenu';
import { MoreMenu } from './MoreMenu/MoreMenu';
import { View } from '../App';
import { clsx } from 'clsx';

const renderMenu = (context: MenuContext, changeView: (value: View) => void) => {
    switch (context.type) {
        case MenuType.contextMenu:
            return <ContextMenu anchorPoint={context.anchorPoint} />;

        case MenuType.moreMenu:
            return <MoreMenu anchorPoint={context.anchorPoint} changeView={changeView} />;

        default:
            throw new UnreachableCaseError(context.type);
    }
};

const Menu = ({ changeView }: { changeView: (value: View) => void }) => {
    const context = useAppSelector((state) => state.session.menuContext);
    const visible = useAppSelector((state) => state.session.menuVisible);

    const dispatch = useAppDispatch();

    const hideMenu = () => {
        dispatch(sessionSlice.actions.hideMenu());
    };

    if (context === undefined) {
        return null;
    }

    // TODO mr refactor the whole menu thing to not use redux / use local state instead like 'changeView'
    return (
        <div
            className={clsx('menu__backdrop', !visible && 'menu__backdrop--hidden')}
            onMouseDown={hideMenu}
            onContextMenu={(e) => e.preventDefault()}>
            {renderMenu(context, changeView)}
        </div>
    );
};

export default Menu;
