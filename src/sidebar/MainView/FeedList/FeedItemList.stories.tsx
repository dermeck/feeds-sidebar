import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { FeedItemList } from './FeedItemList';
import { mozillaFeed } from '../../../storybook/fixtures';
import { withSidebarFrame, withStore } from '../../../storybook/decorators';

const items = mozillaFeed.items.map((item) => ({
    ...item,
    parentId: mozillaFeed.id,
    parentTitle: mozillaFeed.title,
}));

const meta = {
    title: 'sidebar/MainView/FeedItemList',
    component: FeedItemList,
    decorators: [withSidebarFrame, withStore()],
    args: {
        items,
        filterString: '',
    },
} satisfies Meta<typeof FeedItemList>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Read items are hidden, unread items are rendered as links. */
export const Default: Story = {};

/** Items of a feed inside a folder are indented. */
export const Nested: Story = {
    args: { nestedLevel: 1 },
};

/** Only items that match the filter string of the header are rendered. */
export const Filtered: Story = {
    args: { filterString: 'faster' },
};

/** The feed title is prepended in the plain and the date sorted list. */
export const WithFeedTitleLabel: Story = {
    args: { getItemLabel: (item) => `${item.parentTitle} | ${item.title}` },
};

/** Nothing is rendered if all items of the feed are read. */
export const AllItemsRead: Story = {
    args: { items: items.map((item) => ({ ...item, isRead: true })) },
};
