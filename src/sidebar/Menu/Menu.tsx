/** @jsx jsx */
import { jsx } from '@emotion/react';
import { FunctionComponent } from 'react';

import { MenuBackdrop } from '../../base-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import sessionSlice, { MenuContext, MenuType } from '../../store/slices/session';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import ContextMenu from './ContextMenu';
import MoreMenu from './MoreMenu';

const renderMenu = (context: MenuContext) => {
    switch (context.type) {
        case MenuType.contextMenu:
            return <ContextMenu anchorPoint={context.anchorPoint} />;

        case MenuType.moreMenu:
            return <MoreMenu anchorPoint={context.anchorPoint} />;

        default:
            throw new UnreachableCaseError(context.type);
    }
};

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
            {renderMenu(context)}
        </MenuBackdrop>
    );
};

export default Menu;
