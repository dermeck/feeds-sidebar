import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Sidebar from '../Sidebar';
import { View } from '../App';
import { initialState as initialOptionsState } from '../../store/slices/options';
import { sessionFixture, stateFixture } from '../../storybook/fixtures';
import { withSidebarFrame, withStore } from '../../storybook/decorators';

const meta = {
    title: 'sidebar/MainView',
    component: Sidebar,
    decorators: [withSidebarFrame],
    args: {
        activeView: View.feedList,
        changeView: () => undefined,
    },
    render: (args) => <Sidebar activeView={args.activeView} changeView={args.changeView} />,
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PlainList: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            options: { ...initialOptionsState, mainViewDisplayMode: 'plain-list' },
        }),
    ],
};

export const DateSortedList: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            options: { ...initialOptionsState, mainViewDisplayMode: 'date-sorted-list' },
        }),
    ],
};

export const NewFolderEditActive: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            session: { ...sessionFixture, newFolderEditActive: true },
        }),
    ],
};