import { FolderSimplePlus, House, Plus } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import React from 'react';

import { Button } from '../Button/Button';
import { ButtonGroup } from './ButtonGroup';
import { withNarrowContainer } from '../../storybook/decorators';

const meta = {
    title: 'base-components/ButtonGroup',
    component: ButtonGroup,
    decorators: [withNarrowContainer],
    args: {
        children: (
            <>
                <Button variant="toolbar" title="Show all items" active>
                    <House size={18} />
                </Button>
                <Button variant="toolbar" title="Show today's items">
                    <FolderSimplePlus size={18} />
                </Button>
                <Button variant="toolbar" title="Add a new feed">
                    <Plus size={18} />
                </Button>
            </>
        ),
    },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};