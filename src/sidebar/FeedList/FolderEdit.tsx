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

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEditValue(event.target.value);
    };

    const handleOnBlur = () => {
        props.onEditComplete(editValue);
    };

    // TODO handle Enter key

    return <EditInput value={editValue} onChange={handleChange} onBlur={handleOnBlur} />;
};

export default FolderEdit;