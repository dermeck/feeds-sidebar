import styled from '@emotion/styled';

import {
    buttonActiveBackgroundColor,
    buttonActiveTextColor,
    buttonBackgroundColor,
    buttonHoverBackgroundColor,
    buttonHoverTextColor,
    buttonTextColor,
} from './colors';

export const Button = styled.button`
    padding-right: 20px;
    padding-left: 20px;
    border: none;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    background-color: ${(props: { active?: boolean }) =>
        props.active ? buttonActiveBackgroundColor : buttonBackgroundColor};
    border-radius: 4px;
    color: ${buttonTextColor};
    font-size: 13px;

    line-height: 27px;

    :hover {
        color: ${buttonHoverTextColor};
        background-color: ${buttonHoverBackgroundColor};
        opacity: 0.9;
    }

    :active {
        // button is clicked
        color: ${buttonActiveTextColor};
        background-color: ${buttonActiveBackgroundColor};
        opacity: 1;
    }
`;
