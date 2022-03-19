import styled from '@emotion/styled';

import { sidebarBackgroundColor } from './colors';

interface DrawerProps {
    visible?: boolean;
}

export const Drawer = styled.div`
    position: absolute;
    top: 0;

    width: ${(props: DrawerProps) => (props.visible ? '100%' : '0')};
    height: 100%;
    margin-left: ${(props: DrawerProps) => (props.visible ? '0' : '-500px')};

    background-color: ${sidebarBackgroundColor};
    transition: all 0.5s cubic-bezier(0.62, 0.28, 0.23, 0.99); ;
`;
