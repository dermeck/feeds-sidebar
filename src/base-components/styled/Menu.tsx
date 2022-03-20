import styled from '@emotion/styled';

export const menuWidthInPx = 200;

interface MenuBackdropProps {
    visible: boolean;
}

export const MenuBackdrop = styled.div<MenuBackdropProps>`
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;

    visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
    z-index: ${(props) => (props.visible ? 0 : -1)}; ;
`;

interface MenuContainerProps {
    anchorTop: number;
    anchorLeft: number;
}

export const MenuContainer = styled.div<MenuContainerProps>`
    position: absolute;
    top: ${(props) => `${props.anchorTop}px`};
    left: ${(props) => `${props.anchorLeft}px`};

    width: ${menuWidthInPx}px;
    padding: 1px;

    border: 1px solid ${(props) => props.theme.colors.menuBorderColor};
    background-color: ${(props) => props.theme.colors.sidebarBackground};
    border-radius: 2px;
    color: ${(props) => props.theme.colors.sideBarText};
`;

export const MenuList = styled.ul`
    padding: 0;
    margin: 0;

    list-style: none;
`;
