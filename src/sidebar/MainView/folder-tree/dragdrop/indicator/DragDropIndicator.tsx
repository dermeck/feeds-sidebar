import { clsx } from 'clsx';
import React from 'react';

type DragDropIndicatorProps = {
    active: boolean;
};

export const DragDropIndicator = ({ active }: DragDropIndicatorProps) => (
    <div className={clsx('drago-drop__indicator', active && 'drago-drop__indicator--active')} />
);
