import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Badge, BadgeVariant } from './Badge';

const meta = {
    title: 'base-components/Badge',
    component: Badge,
    decorators: [],
    args: {
        children: '3 unread',
    },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

const variants: BadgeVariant[] = ['neutral', 'warning', 'error', 'success'];

/** All variants side by side. */
export const AllVariants: Story = {
    render: (args) => (
        <>
            {variants.map((variant) => (
                <Badge key={variant} {...args} variant={variant} />
            ))}
        </>
    ),
};

/** A quiet label, e.g. for the number of unread items. */
export const Default: Story = {};

export const Warning: Story = {
    args: { variant: 'warning', children: 'offline' },
};

export const Error: Story = {
    args: { variant: 'error', children: '25 failed' },
};

export const Success: Story = {
    args: { variant: 'success', children: 'live' },
};