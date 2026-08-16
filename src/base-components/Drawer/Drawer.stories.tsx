import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Drawer } from './Drawer';
import { withSidebarFrame } from '../../storybook/decorators';

const meta = {
    title: 'base-components/Drawer',
    component: Drawer,
    decorators: [withSidebarFrame],
    args: {
        visible: true,
        children: <div style={{ padding: '0.5rem' }}>Drawer content (e.g. the subscribe view)</div>,
    },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Slides in over the feed list. */
export const Visible: Story = {};

/** Rendered but moved out of the visible area. */
export const Hidden: Story = {
    args: { visible: false },
};
