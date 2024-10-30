import React from 'react';
import { clsx } from 'clsx';

// TODO mr refactor to use color variables

/*
interface ButtonProps {
    active?: boolean; // TODO mr pressed "ui-active" https://codepen.io/shanberg/pen/vbavaP
}
    */

// TODO mr cleanup

export type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
    React.AriaAttributes & { active?: boolean; variant?: 'default' | 'toolbar' };

export const Button = (props: ButtonProps) => {
    const { children, className, active, variant = 'default', ...rest } = props;

    return (
        <button
            className={clsx(
                className,
                'button',
                variant === 'toolbar' && 'toolbar-button',
                active && 'button--ui-active',
            )}
            {...rest}>
            {children}
        </button>
    );
};
