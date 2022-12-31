import styled from '@emotion/styled';

interface ButtonProps {
    active?: boolean;
}

export const Button = styled.button<ButtonProps>`
    padding-right: 20px;
    padding-left: 20px;
    border: none;
    border-radius: 4px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    background-color: ${(props) =>
        props.active ? props.theme.colors.buttonActiveBackgroundColor : props.theme.colors.buttonBackgroundColor};
    color: ${(props) => (props.active ? props.theme.colors.buttonActiveTextColor : props.theme.colors.buttonTextColor)};
    font-size: 13px;

    line-height: 27px;

    :hover {
        background-color: ${(props) => props.theme.colors.buttonHoverBackgroundColor};
        color: ${(props) => props.theme.colors.buttonHoverTextColor};
        opacity: 0.9;
    }

    :active {
        /* button is clicked */
        background-color: ${(props) => props.theme.colors.buttonActiveBackgroundColor};
        color: ${(props) => props.theme.colors.buttonActiveTextColor};
        opacity: 1;
    }
`;
