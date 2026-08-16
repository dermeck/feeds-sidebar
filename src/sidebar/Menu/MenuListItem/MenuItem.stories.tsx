import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { MenuListItem } from './MenuItem';

const meta = {
    title: 'sidebar/Menu/MenuListItem',
    component: MenuListItem,
    args: {
        children: 'Add New Feeds',
        icon: 'plus',
        onMouseDown: () => undefined,
    },
    decorators: [
        (Story) => (
            <div className="menu__container" style={{ position: 'static' }}>
                <ul className="menu__list">
                    <Story />
                </ul>
            </div>
        ),
    ],
} satisfies Meta<typeof MenuListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {};

/** Items of the folder context menu have no icon. */
export const WithoutIcon: Story = {
    args: { icon: undefined, children: 'Mark as Read' },
};
