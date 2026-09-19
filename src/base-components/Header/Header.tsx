import clsx from 'clsx';
import React from 'react';

export const Header = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx('header', className)}>{children}</div>
);