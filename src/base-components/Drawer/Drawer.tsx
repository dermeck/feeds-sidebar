import React from 'react';
import { clsx } from 'clsx';

export const Drawer = ({
    children,
    className,
    visible,
}: {
    children: React.ReactNode;
    className?: string;
    visible: boolean;
}) => <div className={clsx('drawer', className, visible && 'drawer--visible')}>{children}</div>;
