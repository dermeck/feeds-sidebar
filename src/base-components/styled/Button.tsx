import styled from '@emotion/styled';

interface ButtonProps {
    active?: boolean;
}

export const Button = styled.button<ButtonProps>`
    padding-right: 20px;
    padding-left: 20px;
    border: none;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    background-color: ${(props) =>
        props.active ? props.theme.colors.buttonActiveBackgroundColor : props.theme.colors.buttonBackgroundColor};
    border-radius: 4px;
    color: ${(props) => (props.active ? props.theme.colors.buttonActiveTextColor : props.theme.colors.buttonTextColor)};
    font-size: 13px;

    line-height: 27px;

    :hover {
        color: ${(props) => props.theme.colors.buttonHoverTextColor};
        background-color: ${(props) => props.theme.colors.buttonHoverBackgroundColor};
        opacity: 0.9;
    }

    :active {
        // button is clicked
        color: ${(props) => props.theme.colors.buttonActiveTextColor};
        background-color: ${(props) => props.theme.colors.buttonActiveBackgroundColor};
        opacity: 1;
    }
`;
