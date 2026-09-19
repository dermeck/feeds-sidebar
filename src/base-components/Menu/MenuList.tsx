import clsx from 'clsx';
import React from 'react';

type MenuListProps = {
    children: React.ReactNode;
    className?: string;
};

export const MenuList = ({ children, className }: MenuListProps) => (
    <ul className={clsx('menu-list', className)}>{children}</ul>
);