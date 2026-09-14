import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Sidebar from '../Sidebar';
import { View } from '../App';
import { initialState as initialOptionsState } from '../../store/slices/options';
import { sessionFixture, stateFixture } from '../../storybook/fixtures';
import { withSidebarFrame, withStore } from '../../storybook/decorators';

// the main view is always shown beneath the sidebar header (fetch/search/switch buttons),
// so these stories render the complete sidebar and only vary the main view content
const meta = {
    title: 'sidebar/MainView',
    component: Sidebar,
    decorators: [withSidebarFrame, withStore()],
    args: {
        activeView: View.feedList,
        changeView: () => undefined,
    },
    render: (args) => <Sidebar activeView={args.activeView} changeView={args.changeView} />,
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** All feed items of all feeds are listed, prefixed with the feed title. */
export const PlainList: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            options: { ...initialOptionsState, mainViewDisplayMode: 'plain-list' },
        }),
    ],
};

/** All feed items grouped by their publish date. */
export const DateSortedList: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            options: { ...initialOptionsState, mainViewDisplayMode: 'date-sorted-list' },
        }),
    ],
};

/** The new folder input is shown above the tree while a folder is created. */
export const NewFolderEditActive: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            session: { ...sessionFixture, newFolderEditActive: true },
        }),
    ],
};