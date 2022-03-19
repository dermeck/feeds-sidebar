/** @jsx jsx */
import { jsx, ThemeProvider } from '@emotion/react';

import { FunctionComponent } from 'react';

import { MenuBackdrop } from '../../base-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import sessionSlice, { MenuContext, MenuType } from '../../store/slices/session';
import { darkTheme, lightTheme } from '../../theme';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';
import usePrefersColorSchemeDark from '../../utils/hooks/usePrefersColorSchemeDark';
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
    const visible = useAppSelector((state) => state.session.menuVisible);
    const darkMode = usePrefersColorSchemeDark(); // TODO specify theme only once

    const dispatch = useAppDispatch();

    const hideMenu = () => {
        dispatch(sessionSlice.actions.hideMenu());
    };

    if (context === undefined) {
        return null;
    }

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <MenuBackdrop visible={visible} onMouseDown={hideMenu} onContextMenu={(e) => e.preventDefault()}>
                {renderMenu(context)}
            </MenuBackdrop>
        </ThemeProvider>
    );
};

export default Menu;
