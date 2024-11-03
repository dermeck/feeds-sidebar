import React from 'react';
import { clsx } from 'clsx';

export const Header = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx('header', className)}>{children}</div>
);
