import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import Sidebar from './Sidebar';
import Menu from './Menu/Menu';
import { View } from './App';
import { MenuType } from '../store/slices/session';
import { emptyStateFixture, sessionFixture, stateFixture } from '../storybook/fixtures';
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
    decorators: [withSidebarFrame, withStore()],
    args: {
        activeView: View.feedList,
        changeView: () => undefined,
    },
    render: (args) => <SidebarWithMenu activeView={args.activeView} />,
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The complete sidebar, the more menu can be opened and the views can be switched. */
export const Default: Story = {};

export const NoFeeds: Story = {
    decorators: [withStore(emptyStateFixture)],
};

export const SubscribeViewOpen: Story = {
    args: { activeView: View.subscribe },
};

export const DiagnosisViewOpen: Story = {
    args: { activeView: View.diagnosis },
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

/** The spinner of the fetch button is animated while feeds are fetched. */
export const LoadingFeeds: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            session: {
                ...sessionFixture,
                feedStatus: [
                    ...sessionFixture.feedStatus.slice(1),
                    { url: 'https://example.com/feed', status: 'loading' },
                ],
            },
        }),
    ],
};
