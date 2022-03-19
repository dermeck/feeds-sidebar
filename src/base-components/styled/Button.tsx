import styled from '@emotion/styled';

import { colors } from './colors';

export const Button = styled.button`
    padding-right: 20px;
    padding-left: 20px;
    border: none;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    background-color: ${(props: { active?: boolean }) =>
        props.active ? colors.toolbarButtonActiveBackground : colors.toolbarBackground}; // TODO
    border-radius: 4px;
    color: ${colors.toolbarFont};
    font-size: 13px;

    line-height: 27px;

    :hover {
        background-color: ${colors.toolbarButtonHoverBackground}; // TODO
    }

    :active {
        // button is clicked
        background-color: ${colors.toolbarButtonActiveBackground};
    }
`;
