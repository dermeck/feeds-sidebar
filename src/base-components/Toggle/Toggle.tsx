import clsx from 'clsx';
import React from 'react';

type ToggleProps = {
    // omit when the input is labelled by a visible <label htmlFor>
    label?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    id?: string;
    'aria-describedby'?: string;
};

export const Toggle = (props: ToggleProps) => {
    const { label, checked, onChange, disabled, className, ...rest } = props;

    return (
        <label className={clsx('toggle', disabled && 'toggle--disabled', className)}>
            {label && <span className="toggle__label">{label}</span>}
            <input
                className="toggle__input"
                type="checkbox"
                role="switch"
                checked={checked}
                disabled={disabled}
                onChange={(e) => onChange(e.target.checked)}
                {...rest}
            />
            <span className="toggle__control" aria-hidden="true" />
        </label>
    );
};
