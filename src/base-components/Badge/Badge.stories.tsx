import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Badge } from './Badge';

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