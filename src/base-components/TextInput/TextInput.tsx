import clsx from 'clsx';
import React from 'react';

type TextInputProps = {
    label: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    ref?: React.Ref<HTMLInputElement>;
    className?: string;
};

export const TextInput = (props: TextInputProps) => {
    const { label, className, type = 'text', ...rest } = props;

    return <input aria-label={label} className={clsx('text-input', className)} type={type} {...rest} />;
};