import clsx from 'clsx';
import React from 'react';

type ButtonGroupProps = {
    children: React.ReactNode;
    className?: string;
};

export const ButtonGroup = ({ children, className }: ButtonGroupProps) => (
    <div className={clsx('button-group', className)}>{children}</div>
);