import React from 'react';

import { FieldRow } from './FieldRow';

type OptionRowProps = {
    label: string;
    description?: string;
    children: React.ReactNode;
};

export const OptionRow = ({ label, description, children }: OptionRowProps) => (
    <FieldRow
        labelNode={<span className="options__field-label">{label}</span>}
        descriptionNode={description && <p className="options__field-description">{description}</p>}
    >
        {children}
    </FieldRow>
);
