import styled from '@emotion/styled';
import { FolderSimple, CaretDown, CaretRight } from 'phosphor-react';

import React, { Fragment } from 'react';

interface FolderTitleContainerProps {
    selected: boolean;
    focus: boolean;
}

const FolderTitleContainer = styled.div<FolderTitleContainerProps>`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 3px 0 3px 8px;

    background-color: ${(props) =>
        props.selected
            ? props.focus
                ? props.theme.colors.selectedItemBackgroundColor
                : props.theme.colors.selectedItemNoFocusBackgroundColor
            : 'inherit'};
    color: ${(props) =>
        props.selected
            ? props.focus
                ? props.theme.colors.selectedItemTextColor
                : props.theme.colors.selectedItemNoFocusTextColor
            : 'inherit'};
    opacity: 0.9;
`;

const FolderTitle = styled.label`
    overflow: hidden;
    margin-left: 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ToggleIndicator = styled.div`
    margin-right: 4px;
    margin-bottom: -6px;
`;

const FolderIcon = styled(FolderSimple)`
    flex-shrink: 0;
    margin-top: -2px; /* align with label */
`;

interface Props {
    title: string;
    children: React.ReactNode;
    selected: boolean;
    focus: boolean;
    expanded: boolean;
    handleOnClick: () => void;
    handleOnBlur: () => void;
    handleOnContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Folder = (props: Props) => (
    <Fragment>
        <FolderTitleContainer
            selected={props.selected}
            focus={props.focus}
            onClick={props.handleOnClick}
            onBlur={props.handleOnBlur}
            onContextMenu={props.handleOnContextMenu}>
            <ToggleIndicator>
                {props.expanded ? <CaretDown size={12} weight="bold" /> : <CaretRight size={12} weight="bold" />}
            </ToggleIndicator>
            <FolderIcon size={20} weight="light" />
            <FolderTitle>{props.title}</FolderTitle>
        </FolderTitleContainer>

        {props.expanded && props.children}
    </Fragment>
);

if (process.env.MODE === 'dev') {
    Folder.whyDidYouRender = true;
}

export default Folder;
