import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { MessageBar, MessageBarVariant } from './MessageBar';

const message = 'Something worth knowing about the current state of the sidebar.';

const meta = {
    title: 'base-components/MessageBar',
    component: MessageBar,
    args: {
        variant: 'info',
        children: message,
    },
} satisfies Meta<typeof MessageBar>;

export default meta;

type Story = StoryObj<typeof meta>;

const variants: MessageBarVariant[] = ['info', 'warning', 'error', 'success'];

/** All variants side by side. */
export const AllVariants: Story = {
    render: (args) => (
        <>
            {variants.map((variant) => (
                <MessageBar key={variant} {...args} variant={variant} />
            ))}
        </>
    ),
};

export const Info: Story = {};
export const Warning: Story = { args: { variant: 'warning' } };
export const Error: Story = { args: { variant: 'error' } };
export const Success: Story = { args: { variant: 'success' } };