import styled from '@emotion/styled';

import { Button } from './Button';

export const toolbarButtonSideLengthInPx = 32;
export const toolbarButtonPaddingInPx = 4;

export const ToolbarButton = styled(Button)`
    width: ${toolbarButtonSideLengthInPx}px;
    height: ${toolbarButtonSideLengthInPx}px;

    padding: ${toolbarButtonPaddingInPx}px;
    margin: 0;

    background-color: ${(props) =>
        props.active ? props.theme.colors.toolbarButtonActiveBackground : props.theme.colors.toolbarBackgroundColor};
    border-radius: 4px;
    color: ${(props) => props.theme.colors.toolbarTextColor};
    font-size: 13px;

    line-height: 27px;

    :hover {
        background-color: ${(props) =>
            props.active
                ? props.theme.colors.toolbarButtonActiveBackground
                : props.theme.colors.toolbarButtonHoverBackground};
    }

    :active {
        // button is clicked
        background-color: ${(props) => props.theme.colors.toolbarButtonActiveBackground};
    }
`;
