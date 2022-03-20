import styled from '@emotion/styled';

import { Button } from './Button';
import {
    toolbarBackgroundColor,
    toolbarButtonActiveBackground,
    toolbarButtonHoverBackground,
    toolbarTextColor,
} from './colors';

export const toolbarButtonSideLengthInPx = 32;
export const toolbarButtonPaddingInPx = 4;

export const ToolbarButton = styled(Button)`
    width: ${toolbarButtonSideLengthInPx}px;
    height: ${toolbarButtonSideLengthInPx}px;

    padding: ${toolbarButtonPaddingInPx}px;
    margin: 0;

    background-color: ${(props) => (props.active ? toolbarButtonActiveBackground : toolbarBackgroundColor)};
    border-radius: 4px;
    color: ${toolbarTextColor};
    font-size: 13px;

    line-height: 27px;

    :hover {
        background-color: ${(props) => (props.active ? toolbarButtonActiveBackground : toolbarButtonHoverBackground)};
    }

    :active {
        // button is clicked
        background-color: ${toolbarButtonActiveBackground};
    }
`;
