import styled from '@emotion/styled';

interface DrawerProps {
    visible?: boolean;
}

export const Drawer = styled.div`
    position: absolute;
    top: 0;

    width: ${(props: DrawerProps) => (props.visible ? '100%' : '0')};
    height: 100%;
    margin-left: ${(props: DrawerProps) => (props.visible ? '0' : '-500px')};

    background-color: ${(props) => props.theme.colors.sidebarBackground};
    transition: all 0.5s cubic-bezier(0.62, 0.28, 0.23, 0.99); ;
`;
