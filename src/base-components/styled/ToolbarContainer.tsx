import styled from '@emotion/styled';

export const toolbarContainerheight = '48px';
export const toolbarContainerMarginBottom = '4px';

// TODO mr this is HeaderContainer
export const ToolbarContainer = styled.div`
    display: flex;
    height: ${toolbarContainerheight};
    align-items: center;
    padding-right: 4px;
    padding-left: 4px;
    margin-bottom: ${toolbarContainerMarginBottom};

    background-color: ${(props) => props.theme.colors.toolbarBackgroundColor};
    color: ${(props) => props.theme.colors.toolbarTextColor};
`;
