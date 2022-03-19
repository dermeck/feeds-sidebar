import styled from '@emotion/styled';

import { menuBorderColor } from './colors';

export const Divider = styled.hr`
    border-color: ${menuBorderColor};
    border-right: none;
    border-bottom: none;
    border-left: none;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
`;
