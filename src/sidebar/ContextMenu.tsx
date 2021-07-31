/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { FunctionComponent } from 'react';

import { colors } from '../components/styled/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import feedsSlice from '../store/slices/feeds';
import sessionSlice from '../store/slices/session';

const Backdrop = styled.div`
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;
`;
interface MenuContainerProps {
    anchorTop: number;
    anchorLeft: number;
}

const MenuContainer = styled.div`
    position: absolute;
    top: ${(props: MenuContainerProps) => `${props.anchorTop}px`};
    left: ${(props: MenuContainerProps) => `${props.anchorLeft}px`};

    width: 200px;

    background-color: ${colors.defaultBackgroundColor};
    color: ${colors.defaultColor};

    padding: 1px;
    border: 1px solid ${colors.menuBorder};
    border-radius: 2px;
`;

const MenuList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const MenuItem = styled.li`
    display: flex;
    flex-direction: row;
    list-style: none;
    padding: 0.4rem;

    &:hover {
        color: ${colors.highlightColor1Dark};
        background-color: ${colors.highlightBackgroundColor1};
    }

    padding-left: 24px;
`;

const ContextMenu: FunctionComponent = () => {
    const context = useAppSelector((state) => state.session.menuContext);

    const dispatch = useAppDispatch();

    const hideMenu = () => {
        dispatch(sessionSlice.actions.hideMenu());
    };

    const deleteSelectedFeed = () => {
        dispatch(feedsSlice.actions.deleteSelectedFeed());
    };

    if (context === undefined) {
        return null;
    }

    // TODO open menu to the left if x coordinate is to far right
    return (
        <Backdrop onClick={hideMenu} onMouseDown={hideMenu} onContextMenu={(e) => e.preventDefault()}>
            <MenuContainer anchorTop={context.anchorPoint.y} anchorLeft={context.anchorPoint.x}>
                <MenuList>
                    <MenuItem onClick={deleteSelectedFeed}>Delete Feed</MenuItem>
                </MenuList>
            </MenuContainer>
        </Backdrop>
    );
};

export default ContextMenu;
