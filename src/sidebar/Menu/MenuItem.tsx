/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { DownloadSimple, UploadSimple, CheckSquare, Plus } from 'phosphor-react';

import { FunctionComponent, MouseEventHandler } from 'react';

import { UnreachableCaseError } from '../../utils/UnreachableCaseError';

type IconKeys = 'plus' | 'import' | 'export' | 'check-square';

interface Props {
    icon?: IconKeys;
    children: React.ReactNode;
    onMouseDown: MouseEventHandler<HTMLLIElement>;
}

export const StyledListItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 6.5px;
    padding-left: ${(props: { hasIcon: boolean }) => (props.hasIcon ? '4px' : '24px')};

    list-style: none;

    &:hover {
        background-color: ${(props) => props.theme.colors.menuHoverBackgroundColor};
        color: ${(props) => props.theme.colors.menuHoverTextColor};
    }
`;

const IconContainer = styled.div`
    /* center the icon */
    width: 24px;
    height: 18px;
    margin-right: 2px;
    padding-left: 4px;
`;

const renderIcon = (key: IconKeys) => {
    const size = 18;

    switch (key) {
        case 'plus':
            return <Plus size={size} />;

        case 'import':
            return <DownloadSimple size={size} weight="bold" />;

        case 'export':
            return <UploadSimple size={size} weight="bold" />;

        case 'check-square':
            return <CheckSquare size={size} weight="bold" />;

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
