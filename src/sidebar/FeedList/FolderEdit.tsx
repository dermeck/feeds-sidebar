import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { FolderSimple } from 'phosphor-react';

import React, { ChangeEvent, useState } from 'react';

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 1px;
    padding-bottom: 1px;

    padding-left: 20px;
`;

const EditInput = styled.input`
    flex: 1;
    margin-right: 28px; /* align with XButton which is 22px wide and its parent has 6px padding */
`;

const FolderIcon = styled(FolderSimple)`
    flex-shrink: 0;
    margin-top: -2px; /* align with label */
    margin-right: ${(props) => props.theme.iconRightSpacing}px;
`;

interface Props {
    initialValue: string;
    onEditComplete: (x: string) => void;
}

const FolderEdit = (props: Props) => {
    const theme = useTheme();

    const [editValue, setEditValue] = useState(props.initialValue);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => setEditValue(event.target.value);

    const handleBlur = () => props.onEditComplete(editValue);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'Enter') {
            props.onEditComplete(editValue);
        }
    };

    return (
        <Wrapper>
            <FolderIcon size={theme.folderIconSize} weight="light" />

            <EditInput
                theme={theme}
                autoFocus
                value={editValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
            />
        </Wrapper>
    );
};

export default FolderEdit;
