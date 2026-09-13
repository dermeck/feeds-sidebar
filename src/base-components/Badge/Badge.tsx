import clsx from 'clsx';
import React from 'react';

type BadgeProps = {
    children: React.ReactNode;
    className?: string;
};

export const Badge = ({ children, className }: BadgeProps) => (
    <span className={clsx('badge', className)}>{children}</span>
);