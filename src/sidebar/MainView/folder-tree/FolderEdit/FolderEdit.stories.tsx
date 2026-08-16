import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { FolderEdit } from './FolderEdit';
import { withSidebarFrame } from '../../../../storybook/decorators';

const meta = {
    title: 'sidebar/MainView/FolderEdit',
    component: FolderEdit,
    decorators: [withSidebarFrame],
    args: {
        initialValue: 'New Folder',
        onEditComplete: () => undefined,
    },
} satisfies Meta<typeof FolderEdit>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Shown while a new folder is created, the input content is preselected. */
export const NewFolder: Story = {};

export const RenameFolder: Story = {
    args: { initialValue: 'News' },
};
