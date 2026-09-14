import React from 'react';
import { ArrowsClockwise } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Button } from './Button';

const meta = {
    title: 'base-components/Button',
    component: Button,
    args: {
        children: 'Add New Feed',
        variant: 'default',
        active: false,
        disabled: false,
    },
    argTypes: {
        variant: { control: 'inline-radio', options: ['default', 'toolbar'] },
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
    args: { disabled: true },
};

/** Icon only button as used in the header / toolbar. */
export const Toolbar: Story = {
    args: {
        variant: 'toolbar',
        title: 'Fetch all Feeds',
        children: <ArrowsClockwise size={22} />,
    },
};

/** A toolbar button that represents the currently active option. */
export const ToolbarActive: Story = {
    args: {
        ...Toolbar.args,
        active: true,
    },
};
