import React from 'react';
import { TextInput } from '../../base-components/TextInput/TextInput';
import { OptionField } from './OptionField';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Number() coerces a blank value to 0 and accepts other notations, like hex, that are no valid count
const parseNumber = (value: string): number | undefined => {
    const parsed = Number(value);

    return value.trim() === '' || !Number.isFinite(parsed) ? undefined : parsed;
};

type NumberFieldProps = {
    label: string;
    description?: string;
    value: number;
    min: number;
    max?: number;
    disabled?: boolean;
    onCommit: (value: number) => void;
};

export const NumberField = ({ label, description, value, min, max, disabled, onCommit }: NumberFieldProps) => {
    const [localValue, setLocalValue] = React.useState<string>(value.toString());
    const [previousValue, setPreviousValue] = React.useState(value);

    if (value !== previousValue) {
        setPreviousValue(value);
        setLocalValue(value.toString());
    }

    const commit = () => {
        const parsed = parseNumber(localValue);

        if (parsed === undefined) {
            // nothing usable was entered, so keep showing what is stored
            setLocalValue(value.toString());
            return;
        }

        const next = max === undefined ? parsed : clamp(parsed, min, max);
        setLocalValue(next.toString());
        onCommit(next);
    };

    return (
        <OptionField label={label} description={description}>
            <TextInput
                className="options__number-input"
                type="number"
                min={min}
                max={max}
                disabled={disabled}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.currentTarget.blur();
                    }
                }}
            />
        </OptionField>
    );
};
