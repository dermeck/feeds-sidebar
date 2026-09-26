import clsx from 'clsx';
import React from 'react';

type TextInputProps = {
    // omit when the input is labelled by a visible <label htmlFor>
    label?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    ref?: React.Ref<HTMLInputElement>;
    className?: string;
    min?: number;
    max?: number;
    step?: number;
    id?: string;
    'aria-describedby'?: string;
};

export const TextInput = (props: TextInputProps) => {
    const { label, className, type = 'text', ...rest } = props;

    return <input aria-label={label} className={clsx('text-input', className)} type={type} {...rest} />;
};
