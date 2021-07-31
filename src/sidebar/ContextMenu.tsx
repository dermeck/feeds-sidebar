/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { FunctionComponent, useEffect } from 'react';

import { colors } from '../components/styled/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import feedsSlice from '../store/slices/feeds';
import sessionSlice from '../store/slices/session';

interface MenuContainerProps {
    anchorTop: number;
    anchorLeft: number;
}

const MenuContainer = styled.div`
    position: absolute;
    top: ${(props: MenuContainerProps) => `${props.anchorTop}px`};
    left: ${(props: MenuContainerProps) => `${props.anchorLeft}px`};

    width: 200px;

    background-color: white; // TODO
    color: #38383d; // TODO
    border: 2px solid ${colors.menuBorder};
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

    const hideMenu = (e: MouseEvent) => {
        e.preventDefault(); // TODO make sure that click only causes blur and does not trigger click events on feed items etc
        dispatch(sessionSlice.actions.hideMenu());
    };

    const deleteSelectedFeed = () => {
        dispatch(feedsSlice.actions.deleteSelectedFeed());
    };

    useEffect(() => {
        document.addEventListener('click', hideMenu);
        return () => {
            document.removeEventListener('click', hideMenu);
        };
    });

    if (context === undefined) {
        return null;
    }

    // TODO open menu to the left if x coordinate is to far right
    return (
        <MenuContainer anchorTop={context.anchorPoint.y} anchorLeft={context.anchorPoint.x}>
            <MenuList>
                <MenuItem onClick={deleteSelectedFeed}>Delete Feed</MenuItem>
            </MenuList>
        </MenuContainer>
    );
};

export default ContextMenu;
