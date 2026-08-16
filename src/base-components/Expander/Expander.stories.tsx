import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Expander } from './Expander';
import { withSidebarFrame } from '../../storybook/decorators';

const InteractiveExpander = (props: React.ComponentProps<typeof Expander>) => {
    const [expanded, setExpanded] = useState(true);

    return <Expander {...props} expanded={expanded} onClick={() => setExpanded((x) => !x)} />;
};

const meta = {
    title: 'base-components/Expander',
    component: Expander,
    decorators: [withSidebarFrame],
    args: {
        title: 'Today',
        expanded: true,
        onClick: () => undefined,
        children: <div style={{ padding: '0.5rem' }}>The feed items of this section.</div>,
    },
} satisfies Meta<typeof Expander>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Expanded: Story = {};

export const Collapsed: Story = {
    args: { expanded: false },
};

/** Expanding and collapsing is controlled by the parent, here by local state. */
export const Interactive: Story = {
    render: (args) => <InteractiveExpander {...args} />,
};
