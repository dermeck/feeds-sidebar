import styled from '@emotion/styled';

import { colors } from './colors';

export const Button = styled.button`
    padding-right: 20px;
    padding-left: 20px;
    border: none;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    background-color: inherit;
    background-color: ${(props: { active?: boolean }) =>
        props.active ? colors.toolbarButtonActiveBackground : colors.toolbarBackground};
    border-radius: 4px;
    color: ${colors.toolbarFont};
    font-size: 13px;

    line-height: 27px;

    :hover {
        background-color: ${colors.toolbarButtonHoverBackground};
    }
    :active {
        background-color: ${colors.toolbarButtonActiveBackground};
    }
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
