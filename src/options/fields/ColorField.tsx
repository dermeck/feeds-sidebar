import React from 'react';

import { OptionField } from './OptionField';

type ColorFieldProps = {
    label: string;
    description?: string;
    value: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    id?: string;
    'aria-describedby'?: string;
};

export const ColorField = ({ label, description, value, disabled, onChange, ...rest }: ColorFieldProps) => (
    <OptionField label={label} description={description}>
        <input
            className="color-field__input"
            type="color"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            {...rest}
        />
    </OptionField>
);
