import styled from '@emotion/styled';

export const toolbarContainerheight = '48px'; // TODO mr use var

// TODO mr main content container
export const FullHeightScrollContainer = styled.div`
    padding-top: 4px;
    height: calc(100vh - ${toolbarContainerheight});
    overflow-x: scroll;
`;
