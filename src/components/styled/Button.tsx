import styled from '@emotion/styled';

import { colors } from './colors';

export const Button = styled.button`
    :hover {
        background-color: rgba(207, 207, 207, 0.66);
    }
    background-color: inherit;
    background-color: rgba(207, 207, 207, 0.33); // TODO
    border: none;

    color: ${colors.toolbarFont};

    font-size: 13px;
    padding-inline-start: 20px;
    padding-inline-end: 20px;
    line-height: 27px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    border-radius: 4px;
`;

export const ToolbarButton = styled(Button)`
    width: 32px;
    height: 32px;

    padding: 4px;
    margin: 0;

    background-color: ${colors.toolbarBackground};

    :hover {
        background-color: ${colors.toolbarButtonHoverBackground};
    }

    :active {
        background-color: ${colors.toolbarButtonActiveBackground};
    }

    border-radius: 4px;
`;
