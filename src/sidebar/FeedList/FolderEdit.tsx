import styled from '@emotion/styled';

import React, { ChangeEvent, useState } from 'react';

const EditInput = styled.input`
    flex: 1;
    border-width: 1px;
    margin-right: 28px; /* align with XButton which is 22px wide and its parent has 6px padding */
`;

interface Props {
    initialValue: string;
    onEditComplete: (x: string) => void;
}

const FolderEdit = (props: Props) => {
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
        <EditInput
            autoFocus
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
        />
    );
};

export default FolderEdit;
