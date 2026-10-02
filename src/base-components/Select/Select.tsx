import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

type SelectOption<T extends string> = {
    value: T;
    label: string;
};

type SelectProps<T extends string> = {
    // omit when the select is labelled by a visible <label htmlFor>
    label?: string;
    value: T;
    options: SelectOption<T>[];
    onChange: (value: T) => void;
    disabled?: boolean;
    className?: string;
    id?: string;
    'aria-describedby'?: string;
};

export const Select = <T extends string>(props: SelectProps<T>) => {
    const { label, value, options, onChange, disabled, className, ...rest } = props;

    return (
        <div className={clsx('select', className)}>
            <select
                className="select__control"
                value={value}
                disabled={disabled}
                aria-label={label}
                onChange={(e) => onChange(e.target.value as T)}
                {...rest}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <CaretDown size={12} className="select__icon" />
        </div>
    );
};
