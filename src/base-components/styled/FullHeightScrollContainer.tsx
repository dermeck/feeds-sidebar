import styled from '@emotion/styled';

import { toolbarContainerheight } from './ToolbarContainer';

export const FullHeightScrollContainer = styled.div`
    height: ${() => {
        const innerheight = `${window.innerHeight}px`;

        return `calc(${innerheight} - ${toolbarContainerheight})`;
    }};

    overflow-x: scroll;
`;
