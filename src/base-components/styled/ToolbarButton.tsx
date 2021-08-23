import styled from '@emotion/styled';

import { Button } from './Button';

export const toolbarButtonSideLengthInPx = 32;
export const toolbarButtonPaddingInPx = 4;

export const ToolbarButton = styled(Button)`
    width: ${toolbarButtonSideLengthInPx}px;
    height: ${toolbarButtonSideLengthInPx}px;

    padding: ${toolbarButtonPaddingInPx}px;
    margin: 0;
`;
