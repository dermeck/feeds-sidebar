import clsx from 'clsx';
import React from 'react';

export type Point = { x: number; y: number };

type MenuProps = {
    anchorPoint: Point;
    children: React.ReactNode;
    className?: string;
};

export const Menu = ({ anchorPoint, children, className }: MenuProps) => (
    <div
        className={clsx('menu', className)}
        style={
            {
                '--menu-anchor-left': `${anchorPoint.x}px`,
                '--menu-anchor-top': `${anchorPoint.y}px`,
            } as React.CSSProperties
        }>
        {children}
    </div>
);