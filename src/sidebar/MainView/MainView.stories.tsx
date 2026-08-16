import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { MainView } from './MainView';
import { emptyStateFixture, sessionFixture, stateFixture } from '../../storybook/fixtures';
import { withSidebarFrame, withStore } from '../../storybook/decorators';

const meta = {
    title: 'sidebar/MainView',
    component: MainView,
    decorators: [withSidebarFrame, withStore()],
    args: {
        displayMode: 'folder-tree',
        filterString: '',
    },
} satisfies Meta<typeof MainView>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Feeds grouped by the folders they are assigned to. */
export const FolderTree: Story = {};

/** All feed items of all feeds, prefixed with the feed title. */
export const PlainList: Story = {
    args: { displayMode: 'plain-list' },
};

/** All feed items grouped by their publish date. */
export const DateSortedList: Story = {
    args: { displayMode: 'date-sorted-list' },
};

export const Filtered: Story = {
    args: { displayMode: 'plain-list', filterString: 'Nachrichten' },
};

export const NoFeeds: Story = {
    decorators: [withStore(emptyStateFixture)],
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
