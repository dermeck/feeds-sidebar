import React from 'react';

type FieldRowProps = {
    labelNode: React.ReactNode;
    descriptionNode?: React.ReactNode;
    children: React.ReactNode;
};

export const FieldRow = ({ labelNode, descriptionNode, children }: FieldRowProps) => (
    <div className="options__field">
        <div className="options__field-text">
            {labelNode}
            {descriptionNode}
        </div>
        {children}
    </div>
);
