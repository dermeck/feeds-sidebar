import styled from '@emotion/styled';

export const ScrollContainer = styled.div`
    overflow-x: scroll;

    height: ${(props: { height: number }) => `${props.height}px`};
`;
