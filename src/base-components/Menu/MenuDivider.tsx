import clsx from 'clsx';
import React from 'react';

type MenuDividerProps = {
    className?: string;
};

export const MenuDivider = ({ className }: MenuDividerProps) => <hr className={clsx('menu-divider', className)} />;