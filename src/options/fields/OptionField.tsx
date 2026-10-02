import React from 'react';

import { FieldRow } from './FieldRow';

type OptionFieldProps = {
    label: string;
    description?: string;
    children: React.ReactElement<{ id?: string; 'aria-describedby'?: string }>;
};

export const OptionField = ({ label, description, children }: OptionFieldProps) => {
    const controlId = React.useId();
    const descriptionId = description ? `${controlId}-description` : undefined;

    return (
        <FieldRow
            labelNode={
                <label className="options__field-label" htmlFor={controlId}>
                    {label}
                </label>
            }
            descriptionNode={
                description && (
                    <p className="options__field-description" id={descriptionId}>
                        {description}
                    </p>
                )
            }
        >
            {React.cloneElement(children, { id: controlId, 'aria-describedby': descriptionId })}
        </FieldRow>
    );
};
