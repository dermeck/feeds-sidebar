import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React, { useState } from 'react';

import { Select } from './Select';
import { withNarrowContainer } from '../../storybook/decorators';

const options = [
    { value: 'auto', label: 'Auto' },
    { value: 'builtin-theme', label: 'Built-in theme' },
    { value: 'system-theme', label: 'System theme' },
];

const SelectDemo = ({ initialValue, disabled = false }: { initialValue: string; disabled?: boolean }) => {
    const [value, setValue] = useState(initialValue);

    return (
        <Select label="Sidebar background" value={value} options={options} onChange={setValue} disabled={disabled} />
    );
};

const meta = {
    title: 'base-components/Select',
    component: Select,
    decorators: [withNarrowContainer],
    args: {
        label: 'Sidebar background',
        value: 'auto',
        options,
        onChange: () => undefined,
    },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const Interactive: Story = {
    args: { value: 'auto' },
    render: (args) => <SelectDemo initialValue={args.value} />,
};
