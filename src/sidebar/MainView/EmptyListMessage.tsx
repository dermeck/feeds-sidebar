import React from 'react';
import { clsx } from 'clsx';

type EmptyListMessageProps = {
    className?: string;
    filterString: string;
};

export const EmptyListMessage = ({ className, filterString }: EmptyListMessageProps) => {
    return (
        <div className={clsx('empty-list-message', className)}>
            {filterString ? (
                <p className="empty-list-message__text">No items match “{filterString}”.</p>
            ) : (
                <p className="empty-list-message__text">No unread items.</p>
            )}
        </div>
    );
};