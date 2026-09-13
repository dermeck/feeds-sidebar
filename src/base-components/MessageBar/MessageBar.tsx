import { CheckCircle, Info, Warning, WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

export type MessageBarVariant = 'info' | 'warning' | 'error' | 'success';

type MessageBarProps = {
    variant?: MessageBarVariant;
    children: React.ReactNode;
    className?: string;
};

const variantIcons: Record<MessageBarVariant, React.ReactNode> = {
    info: <Info size={18} weight="fill" />,
    warning: <Warning size={18} weight="fill" />,
    error: <WarningCircle size={18} weight="fill" />,
    success: <CheckCircle size={18} weight="fill" />,
};

export const MessageBar = ({ variant = 'info', children, className }: MessageBarProps) => (
    <div role={variant === 'error' ? 'alert' : 'status'} className={clsx('message-bar', `message-bar--${variant}`, className)}>
        <span className="message-bar__icon" aria-hidden="true">
            {variantIcons[variant]}
        </span>
        <div>{children}</div>
    </div>
);