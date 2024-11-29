import { clsx } from 'clsx';
import React from 'react';

type DragDropIndicatorProps = {
    type: 'top' | 'bottom';
    active: boolean;
};

export const DragDropIndicator = ({ active, type }: DragDropIndicatorProps) => (
    <div
        className={clsx(
            'drag-drop__indicator',
            `drag-drop__indicator-${type}`,
            active && 'drag-drop__indicator--active',
        )}
    />
);
