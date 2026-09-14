import { CheckSquare, FolderSimplePlus, Plus, Trash } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';

import { Menu } from './Menu';
import { MenuDivider } from './MenuDivider';
import { MenuItem } from './MenuItem';
import { MenuList } from './MenuList';

const meta = {
    title: 'base-components/Menu',
    component: Menu,
    args: {
        anchorPoint: { x: 40, y: 8 },
        children: (
            <MenuList>
                <MenuItem onMouseDown={() => undefined}>Mark as Read</MenuItem>
                <MenuItem onMouseDown={() => undefined}>Rename</MenuItem>
                <MenuDivider />
                <MenuItem icon={<Trash size={14} />} onMouseDown={() => undefined}>
                    Delete
                </MenuItem>
            </MenuList>
        ),
    },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A context menu opened at an anchor point. */
export const Default: Story = {};

/** Menu items with icons as used e.g. by the more menu of the sidebar header. */
export const WithIcons: Story = {
    args: {
        children: (
            <MenuList>
                <MenuItem icon={<Plus size={18} />} onMouseDown={() => undefined}>
                    Add New Feeds
                </MenuItem>
                <MenuItem icon={<FolderSimplePlus size={18} />} onMouseDown={() => undefined}>
                    New Folder
                </MenuItem>
                <MenuItem icon={<CheckSquare size={18} weight="bold" />} onMouseDown={() => undefined}>
                    Mark All Read
                </MenuItem>
            </MenuList>
        ),
    },
};