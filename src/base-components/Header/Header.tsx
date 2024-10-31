import React from 'react';
import { clsx } from 'clsx';

export type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> &
    React.AriaAttributes & { active?: boolean; variant?: 'default' | 'toolbar' };

export const Header = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={clsx('header', className)}>{children}</div>;
};
