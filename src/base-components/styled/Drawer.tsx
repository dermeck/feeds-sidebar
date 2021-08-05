import styled from '@emotion/styled';

interface DrawerProps {
    show?: boolean;
}

export const Drawer = styled.div`
    background-color: #fff;
    position: absolute;
    top: 0;
    height: 100%;

    width: ${(props: DrawerProps) => (props.show ? '100%' : '0')};
    margin-left: ${(props: DrawerProps) => (props.show ? '0' : '-500px')};

    transition: all 0.5s cubic-bezier(0.62, 0.28, 0.23, 0.99); ;
`;
