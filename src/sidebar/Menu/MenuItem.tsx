/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { FunctionComponent, MouseEventHandler } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Plus } from 'react-feather';

import { colors } from '../../base-components/styled/colors';
import { UnreachableCaseError } from '../../utils/UnreachableCaseError';

type IconKeys = 'plus' | 'arrowDown-circle' | 'arrowUp-circle';

interface Props {
    icon?: IconKeys;
    children: React.ReactNode;
    onMouseDown: MouseEventHandler<HTMLLIElement>;
}

export const StyledListItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 0.4rem;
    padding-left: ${(props: { hasIcon: boolean }) => (props.hasIcon ? '4px' : '24px')};

    list-style: none;

    &:hover {
        background-color: ${colors.highlightBackgroundColor1};
        color: ${colors.highlightColor1Dark};
    }
`;

const IconContainer = styled.div`
    /* center the icon */
    width: 24px;
    height: 16px;
    padding-left: 4px;
`;

const renderIcon = (key: IconKeys) => {
    const size = 16;

    switch (key) {
        case 'plus':
            return <Plus size={size} />;

        case 'arrowDown-circle':
            return <ArrowDownCircle size={size} />;

        case 'arrowUp-circle':
            return <ArrowUpCircle size={size} />;

        default:
            throw new UnreachableCaseError(key);
    }
};

const MenuItem: FunctionComponent<Props> = (props: Props) => {
    return (
        <StyledListItem onMouseDown={props.onMouseDown} hasIcon={props.icon !== undefined}>
            {props.icon && <IconContainer>{renderIcon(props.icon)}</IconContainer>}
            <div>{props.children}</div>
        </StyledListItem>
    );
};

export default MenuItem;
