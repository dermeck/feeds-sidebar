import styled from '@emotion/styled';

export const toolbarContainerheight = '3.6rem';

export const ToolbarContainer = styled.div`
    display: flex;
    height: ${toolbarContainerheight};
    align-items: center;
    padding-right: 0.3rem;
    padding-left: 0.3rem;
    margin-bottom: 0.8rem;

    background-color: ${(props) => props.theme.colors.toolbarBackgroundColor};
    color: ${(props) => props.theme.colors.toolbarTextColor};
`;
