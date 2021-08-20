import styled from '@emotion/styled';

interface DrawerProps {
    show?: boolean;
}

export const Drawer = styled.div`
    position: absolute;
    top: 0;

    width: ${(props: DrawerProps) => (props.show ? '100%' : '0')};
    height: 100%;
    margin-left: ${(props: DrawerProps) => (props.show ? '0' : '-500px')};

    background-color: #fff;
    transition: all 0.5s cubic-bezier(0.62, 0.28, 0.23, 0.99); ;
`;
