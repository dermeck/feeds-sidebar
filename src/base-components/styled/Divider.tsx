import styled from '@emotion/styled';

export const Divider = styled.hr`
    border-color: ${(props) => props.theme.colors.menuBorderColor};
    border-right: none;
    border-bottom: none;
    border-left: none;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
`;
