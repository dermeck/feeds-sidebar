import styled from '@emotion/styled';
import { FolderSimple, CaretDown, CaretRight } from 'phosphor-react';

import React, { Fragment } from 'react';

interface FeedTitleContainerProps {
    selected: boolean;
    focus: boolean;
}

const FeedTitleContainer = styled.div<FeedTitleContainerProps>`
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

const FeedTitle = styled.label`
    overflow: hidden;
    margin-left: 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ToggleIndicator = styled.div`
    margin-right: 4px;
    margin-bottom: -6px;
`;

const FeedFolderIcon = styled(FolderSimple)`
    flex-shrink: 0;
    margin-top: -2px; /* align with label */
`;

interface Props {
    label: string;
    children: React.ReactNode;
    isSelected: boolean;
    focus: boolean;
    expanded: boolean;
    handleOnClick: () => void;
    handleOnBlur: () => void;
    handleOnContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Folder = (props: Props) => {
    return (
        <Fragment>
            <FeedTitleContainer
                selected={props.isSelected}
                focus={props.focus}
                onClick={props.handleOnClick}
                onBlur={props.handleOnBlur}
                onContextMenu={props.handleOnContextMenu}>
                <ToggleIndicator>
                    {props.expanded ? <CaretDown size={12} weight="bold" /> : <CaretRight size={12} weight="bold" />}
                </ToggleIndicator>
                <FeedFolderIcon size={20} weight="light" />
                <FeedTitle>{props.label}</FeedTitle>
            </FeedTitleContainer>

            {props.expanded && props.children}
        </Fragment>
    );
};

export default Folder;
