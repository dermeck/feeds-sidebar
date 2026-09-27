import React from 'react';

type OptionFieldProps = {
    label: string;
    description?: string;
    children: React.ReactElement<{ id?: string; 'aria-describedby'?: string }>;
};

export const OptionField = ({ label, description, children }: OptionFieldProps) => {
    const controlId = React.useId();
    const descriptionId = description ? `${controlId}-description` : undefined;

    return (
        <div className="options__field">
            <div className="options__field-text">
                <label className="options__field-label" htmlFor={controlId}>
                    {label}
                </label>
                {description && (
                    <p className="options__field-description" id={descriptionId}>
                        {description}
                    </p>
                )}
            </div>
            {React.cloneElement(children, { id: controlId, 'aria-describedby': descriptionId })}
        </div>
    );
};
