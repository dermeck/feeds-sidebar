import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { DiagnosisView } from './DiagnosisView';
import { Feed } from '../../model/feeds';
import { emptyStateFixture, sessionFixture, stateFixture } from '../../storybook/fixtures';
import { View } from '../App';
import Sidebar from '../Sidebar';
import { withSidebarFrame, withStore } from '../../storybook/decorators';

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

// fetched recently, but all items are much older than the inactivity threshold (60 days),
// so this feed shows up in the warning-colored 'Inactive feeds' section
const staleFeed: Feed = {
    id: 'https://example.com/stale-feed.xml',
    title: 'Stale Example Feed',
    link: 'https://example.com/',
    lastFetched: daysAgo(3),
    items: [
        {
            id: 'https://example.com/stale-feed.xml#1',
            title: 'A very old item',
            url: 'https://example.com/very-old-item/',
            published: daysAgo(90),
            isRead: false,
        },
    ],
};

const meta = {
    title: 'sidebar/DiagnosisView',
    component: DiagnosisView,
    decorators: [withSidebarFrame],
    args: {
        onClose: () => undefined,
    },
} satisfies Meta<typeof DiagnosisView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            feeds: {
                feeds: [...(stateFixture.feeds?.feeds ?? []), staleFeed],
                folders: stateFixture.feeds?.folders ?? [],
                selectedNode: stateFixture.feeds?.selectedNode,
            },
            session: {
                ...sessionFixture,
                feedStatus: [...sessionFixture.feedStatus, { url: staleFeed.id, status: 'loaded' }],
            },
        }),
    ],
};

export const NoFeeds: Story = {
    decorators: [withStore(emptyStateFixture)],
};

export const InSidebar: Story = {
    decorators: [withStore()],
    render: () => <Sidebar activeView={View.diagnosis} changeView={() => undefined} />,
};