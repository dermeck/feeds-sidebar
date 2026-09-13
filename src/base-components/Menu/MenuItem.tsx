import clsx from 'clsx';
import React from 'react';

type MenuItemProps = {
    children: React.ReactNode;
    icon?: React.ReactNode;
    onMouseDown: React.MouseEventHandler<HTMLLIElement>;
    className?: string;
};

export const MenuItem = ({ children, icon, onMouseDown, className }: MenuItemProps) => (
    <li
        className={clsx('menu-item', icon !== undefined && 'menu-item--with-icon', className)}
        onMouseDown={onMouseDown}>
        {icon !== undefined && <span className="menu-item__icon">{icon}</span>}
        <div>{children}</div>
    </li>
);