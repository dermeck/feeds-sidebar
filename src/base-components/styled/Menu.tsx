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

    background-color: ${colors.defaultBackgroundColor};
    color: ${colors.defaultColor};

    padding: 1px;
    border: 1px solid ${colors.menuBorder};
    border-radius: 2px;
`;

export const MenuList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;
