import styled from '@emotion/styled';

import React, { ChangeEvent, useEffect, useState } from 'react';

import useFocus from '../../utils/hooks/useFocus';

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
    const [inputRef, setFocus] = useFocus<HTMLInputElement>();

    useEffect(() => {
        setFocus();
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => setEditValue(event.target.value);

    const handleOnBlur = () => props.onEditComplete(editValue);

    const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.code === 'Enter') {
            props.onEditComplete(editValue);
        }
    };

    return (
        <EditInput
            ref={inputRef}
            value={editValue}
            onChange={handleChange}
            onBlur={handleOnBlur}
            onKeyDown={handleOnKeyDown}
        />
    );
};

export default FolderEdit;
