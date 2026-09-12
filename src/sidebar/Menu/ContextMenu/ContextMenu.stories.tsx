import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { ContextMenu } from './ContextMenu';
import { NodeType } from '../../../model/feeds';
import { feedsFixture, foldersFixture, newsFolderId, stateFixture } from '../../../storybook/fixtures';
import { withSidebarFrame, withStore } from '../../../storybook/decorators';

const meta = {
    title: 'sidebar/Menu/ContextMenu',
    component: ContextMenu,
    decorators: [
        withSidebarFrame,
        withStore({
            ...stateFixture,
            feeds: {
                feeds: feedsFixture,
                folders: foldersFixture,
                selectedNode: { nodeType: NodeType.Folder, nodeId: newsFolderId },
            },
        }),
    ],
    args: {
        anchorPoint: { x: 40, y: 40 },
    },
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Opened by a right click on a folder or a feed. */
export const Default: Story = {};
