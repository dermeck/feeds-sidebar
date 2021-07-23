import styled from '@emotion/styled';

import { Button } from '.';
import { colors } from './colors';

export const ToolbarButton = styled(Button)`
    width: 32px;
    height: 32px;

    padding: 4px;
    margin: 0;

    background-color: ${(props: { active?: boolean }) =>
        props.active ? colors.toolbarButtonActiveBackground : colors.toolbarBackground};
    :hover {
        background-color: ${colors.toolbarButtonHoverBackground};
    }

    :active {
        background-color: ${colors.toolbarButtonActiveBackground};
    }

    border-radius: 4px;
`;
