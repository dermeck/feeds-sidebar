import type { Meta, StoryObj } from '@storybook/react-webpack5';

import React, { useRef } from 'react';

import { SubscribeView } from './SubscribeView';
import { initialState as initialOptionsState } from '../../store/slices/options';
import { sessionFixture, stateFixture } from '../../storybook/fixtures';
import { View } from '../App';
import Sidebar from '../Sidebar';
import { withSidebarFrame, withStore } from '../../storybook/decorators';

/**
 * The ref must not live in `args`: Storybook serializes args and infers their
 * controls by walking every property. Once React fills `ref.current` with a DOM
 * node, that walk follows React's fiber expandos through the whole tree and
 * freezes the tab on story switch (storybookjs/storybook#33821).
 */
const SubscribeViewWithRef = (props: Omit<React.ComponentProps<typeof SubscribeView>, 'urlInputRef'>) => {
    const urlInputRef = useRef<HTMLInputElement>(null);

    return <SubscribeView {...props} urlInputRef={urlInputRef} />;
};

const meta = {
    title: 'sidebar/SubscribeView',
    component: SubscribeViewWithRef,
    decorators: [withSidebarFrame, withStore()],
    args: {
        onClose: () => undefined,
    },
} satisfies Meta<typeof SubscribeViewWithRef>;

export default meta;

type Story = StoryObj<typeof meta>;

/** No feeds were detected on the active tab. */
export const Default: Story = {};

/** Feeds that were detected on the active tab can be added (or removed if already subscribed). */
export const WithDetectedFeeds: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            session: {
                ...sessionFixture,
                detectedFeeds: [
                    {
                        type: 'application/rss+xml',
                        title: 'The Mozilla Blog',
                        href: 'https://blog.mozilla.org/en/feed/',
                    },
                    {
                        type: 'application/rss+xml',
                        title: 'Comments Feed',
                        href: 'https://blog.mozilla.org/en/comments/feed/',
                    },
                    { type: 'application/atom+xml', title: '', href: 'https://blog.mozilla.org/en/no-title/feed/' },
                ],
            },
        }),
    ],
};

/** Feed detection can be turned off in the options. */
export const FeedDetectionDisabled: Story = {
    decorators: [
        withStore({
            ...stateFixture,
            options: { ...initialOptionsState, feedDetectionEnabled: false },
        }),
    ],
};

/** The view as opened from the sidebar, embedded in the drawer. */
export const InSidebar: Story = {
    render: () => <Sidebar activeView={View.subscribe} changeView={() => undefined} />,
};
