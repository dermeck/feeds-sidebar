import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { SubscribeView } from './SubscribeView';
import { initialState as initialOptionsState } from '../../store/slices/options';
import { sessionFixture, stateFixture } from '../../storybook/fixtures';
import { withSidebarFrame, withStore } from '../../storybook/decorators';

const meta = {
    title: 'sidebar/SubscribeView',
    component: SubscribeView,
    decorators: [withSidebarFrame, withStore()],
    args: {
        urlInputRef: { current: null },
        onClose: () => undefined,
    },
} satisfies Meta<typeof SubscribeView>;

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
