import React from 'react';
import { ArrowsClockwise, DotsThreeOutline } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Button } from '../Button/Button';
import { Header } from './Header';
import { withSidebarFrame } from '../../storybook/decorators';

const meta = {
    title: 'base-components/Header',
    component: Header,
    decorators: [withSidebarFrame],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Header of the subscribe view (back button and title). */
export const WithTitle: Story = {
    args: {
        children: (
            <>
                <Button variant="toolbar" title="Back to Feed List">
                    <ArrowsClockwise size={22} />
                </Button>
                <h1 className="subscribe-view__title">Add New Feed</h1>
            </>
        ),
    },
};

/** Toolbar header of the sidebar (fetch button, filter input and more menu button). */
export const MainHeader: Story = {
    args: {
        className: 'sidebar__main-header',
        children: (
            <>
                <Button variant="toolbar" title="Fetch all Feeds">
                    <ArrowsClockwise size={22} />
                </Button>
                <input aria-label="filter text" className="text-input" />
                <Button variant="toolbar" title="More Options">
                    <DotsThreeOutline size={22} weight="fill" />
                </Button>
            </>
        ),
    },
};
