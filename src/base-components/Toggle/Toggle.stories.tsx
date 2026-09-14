import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Toggle } from './Toggle';

const ToggleDemo = ({
    label,
    initialChecked = false,
    disabled = false,
}: {
    label: string;
    initialChecked?: boolean;
    disabled?: boolean;
}) => {
    const [checked, setChecked] = useState(initialChecked);

    return <Toggle label={label} checked={checked} onChange={setChecked} disabled={disabled} />;
};

const meta = {
    title: 'base-components/Toggle',
    component: Toggle,
    args: {
        label: 'Detect feeds on visited pages',
        checked: true,
        onChange: () => undefined,
    },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A switch as used e.g. in the options. */
export const On: Story = { args: { checked: true } };

export const Off: Story = { args: { checked: false } };

export const Disabled: Story = { args: { checked: false, disabled: true } };

/** The checked state is controlled by the parent, here by local state. */
export const Interactive: Story = {
    args: { checked: true },
    render: (args) => <ToggleDemo {...args} />,
};

/** Several options stacked vertically. */
export const OptionsStack: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <ToggleDemo label="Detect feeds on visited pages" initialChecked />
            <ToggleDemo label="Notify about new items" />
            <ToggleDemo label="Collapse read items by default" disabled />
        </div>
    ),
};