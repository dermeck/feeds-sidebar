import styled from '@emotion/styled';

import { toolbarContainerheight } from './ToolbarContainer';

export const FullHeightScrollContainer = styled.div`
    overflow-x: scroll;

    height: ${() => {
        const innerheight = `${window.innerHeight}px`;

        return `calc(${innerheight} - ${toolbarContainerheight})`;
    }};
`;
