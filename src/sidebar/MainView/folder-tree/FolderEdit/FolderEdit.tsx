import { FolderSimple } from 'phosphor-react';

import React, { ChangeEvent, useState } from 'react';

interface Props {
    initialValue: string;
    onEditComplete: (x: string) => void;
}

export const FolderEdit = (props: Props) => {
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
        <div className="folder-edit">
            <FolderSimple className="folder-edit__icon" size={20} weight="light" />
            <input
                aria-label="folder edit name"
                className="folder-edit__input"
                autoFocus
                value={editValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};
