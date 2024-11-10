import { CaretDown, CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

export const Expander = ({
    title,
    children,
    expanded,
    onClick,
}: {
    title: string;
    children: React.ReactNode;
    expanded: boolean;
    onClick: () => void;
}) => {
    return (
        <div>
            <div className="expander__header" onClick={onClick}>
                <span>{expanded ? <CaretDown weight="bold" /> : <CaretRight weight="bold" />}</span>
                <span className="expander__header-title">{title}</span>
            </div>
            <div
                className={clsx(
                    'expander__content',
                    expanded ? 'expander__content--expanded' : 'expander__content--collapsed',
                )}>
                {children}
            </div>
        </div>
    );
};
