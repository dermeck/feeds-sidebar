import clsx from 'clsx';
import React from 'react';

export type BadgeVariant = 'neutral' | 'error' | 'warning' | 'success';

type BadgeProps = {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
};

export const Badge = ({ children, variant = 'neutral', className }: BadgeProps) => (
    <span className={clsx('badge', variant !== 'neutral' && `badge--${variant}`, className)}>{children}</span>
);