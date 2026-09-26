import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Sidebar from './Sidebar';
import Menu from './Menu/Menu';
import { View } from './App';
import { MenuType } from '../store/slices/session';
import { emptyStateFixture, mozillaFeedUrl, sessionFixture, stateFixture } from '../storybook/fixtures';
import { withSidebarFrame, withStore } from '../storybook/decorators';

// the menu is a sibling of the sidebar (rendered by App) and needs the same view state
const SidebarWithMenu = ({ activeView }: { activeView: View }) => {
    const [view, setView] = useState(activeView);

    return (
        <>
            <Sidebar activeView={view} changeView={setView} />
            <Menu changeView={setView} />
        </>
    );
};

const meta = {
    title: 'sidebar/Sidebar',
    component: Sidebar,
    decorators: [withSidebarFrame],
    args: {
        activeView: View.feedList,
        changeView: () => undefined,
    },
    render: (args) => <SidebarWithMenu activeView={args.activeView} />,
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    decorators: [withStore()],
};

export const NoFeeds: Story = {
    decorators: [withStore(emptyStateFixture)],
};

export const MoreMenuOpen: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            session: {
                ...sessionFixture,
                menuVisible: true,
                menuContext: { type: MenuType.moreMenu, anchorPoint: { x: 110, y: 40 } },
            },
        }),
    ],
};

export const LoadingFeeds: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            session: {
                ...sessionFixture,
                feedStatus: [...sessionFixture.feedStatus, { url: mozillaFeedUrl, status: 'loading' }],
            },
        }),
    ],
};

const persistenceErrorMessage = 'Changes cannot be saved right now and will be lost when the sidebar is reloaded.';

export const PersistenceError: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            session: {
                ...sessionFixture,
                persistenceError: persistenceErrorMessage,
            },
        }),
    ],
};

export const PersistenceErrorWithoutFeeds: Story = {
    decorators: [
        withStore({
            ...emptyStateFixture,
            session: {
                ...sessionFixture,
                persistenceError: persistenceErrorMessage,
            },
        }),
    ],
};
