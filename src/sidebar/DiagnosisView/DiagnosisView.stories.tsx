import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { DiagnosisView } from './DiagnosisView';
import { emptyStateFixture } from '../../storybook/fixtures';
import { withSidebarFrame, withStore } from '../../storybook/decorators';

const meta = {
    title: 'sidebar/DiagnosisView',
    component: DiagnosisView,
    decorators: [withSidebarFrame, withStore()],
    args: {
        onClose: () => undefined,
    },
} satisfies Meta<typeof DiagnosisView>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Feeds that could not be fetched and feeds without recent items are listed separately. */
export const Default: Story = {};

export const NoFeeds: Story = {
    decorators: [withStore(emptyStateFixture)],
};
