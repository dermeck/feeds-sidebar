import styled from '@emotion/styled';

import { toolbarContainerheight } from './ToolbarContainer';

export const FullHeightScrollContainer = styled.div`
    height: calc(100vh - ${toolbarContainerheight});
    overflow-x: scroll;
`;
