import { MagnifyingGlass, X } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

type SearchInputProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export const SearchInput = ({ label, value, onChange, placeholder, className }: SearchInputProps) => {
    return (
        <div className={clsx('search-input', className)}>
            <MagnifyingGlass size={16} className="search-input__icon" />
            <input
                aria-label={label}
                className="search-input__field"
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
            {value !== '' && (
                <button
                    type="button"
                    className="search-input__clear"
                    aria-label="Clear search"
                    title="Clear search"
                    onClick={() => onChange('')}>
                    <X size={14} weight="bold" />
                </button>
            )}
        </div>
    );
};