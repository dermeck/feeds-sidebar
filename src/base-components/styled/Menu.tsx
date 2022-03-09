import styled from '@emotion/styled';

import { colors } from './colors';

export const menuWidthInPx = 200;

export const MenuBackdrop = styled.div`
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;
`;

interface MenuContainerProps {
    anchorTop: number;
    anchorLeft: number;
}

export const MenuContainer = styled.div`
    position: absolute;
    top: ${(props: MenuContainerProps) => `${props.anchorTop}px`};
    left: ${(props: MenuContainerProps) => `${props.anchorLeft}px`};

    width: ${menuWidthInPx}px;
    padding: 1px;

    border: 1px solid ${colors.menuBorder};
    background-color: ${colors.defaultBackgroundColor};
    border-radius: 2px;
    color: ${colors.defaultColor};
`;

export const MenuList = styled.ul`
    padding: 0;
    margin: 0;

    list-style: none;
`;

export const MenuItem = styled.li`
    display: flex;
    flex-direction: row;
    padding: 0.4rem;
    padding-left: 24px;

    list-style: none;

    &:hover {
        background-color: 'Highlight';
        color: red;
    }
`;
