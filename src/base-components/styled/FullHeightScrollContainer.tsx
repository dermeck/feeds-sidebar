import styled from '@emotion/styled';

import { toolbarContainerheight, toolbarContainerMarginBottom } from './ToolbarContainer';

export const FullHeightScrollContainer = styled.div`
    height: calc(100vh - ${toolbarContainerheight} - ${toolbarContainerMarginBottom});
    overflow-x: scroll;
`;
