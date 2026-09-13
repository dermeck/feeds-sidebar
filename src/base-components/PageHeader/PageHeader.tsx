import clsx from 'clsx';
import React from 'react';

export const PageHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx('page-header', className)}>{children}</div>
);