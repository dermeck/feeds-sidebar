import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { MoreMenu } from './MoreMenu';
import { withSidebarFrame, withStore } from '../../../storybook/decorators';

const meta = {
    title: 'sidebar/Menu/MoreMenu',
    component: MoreMenu,
    decorators: [withSidebarFrame, withStore()],
    args: {
        anchorPoint: { x: 100, y: 8 },
        changeView: () => undefined,
    },
} satisfies Meta<typeof MoreMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Opened by the more options button of the sidebar header. */
export const Default: Story = {};
