import React from 'react';
import { clsx } from 'clsx';

type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
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
