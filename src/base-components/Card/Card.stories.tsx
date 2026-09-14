import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Card } from './Card';

const InteractiveAccordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <Card type="accordion" title={title} expanded={expanded} onClick={() => setExpanded((x) => !x)}>
            {children}
        </Card>
    );
};

const meta = {
    title: 'base-components/Card',
    component: Card,
    args: {
        children: <div style={{ lineHeight: 1.4 }}>The content of the card.</div>,
    },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A plain bordered container, e.g. for a group of feed items. */
export const Default: Story = {};

/** An accordion section as used by the date sorted list. */
export const Accordion: Story = {
    args: {
        type: 'accordion',
        title: 'Today',
        expanded: true,
        onClick: () => undefined,
    },
};

/** Expanding and collapsing is controlled by the parent, here by local state. */
export const AccordionInteractive: Story = {
    args: {
        type: 'accordion',
        title: 'Today',
        expanded: true,
        onClick: () => undefined,
    },
    render: (args) => (
        <InteractiveAccordion title={args.type === 'accordion' ? args.title : 'Today'}>
            {args.children}
        </InteractiveAccordion>
    ),
};

/** Several accordion cards are stacked with a gap between them by default. */
export const AccordionStack: Story = {
    render: (args) => (
        <>
            <InteractiveAccordion title="Today">{args.children}</InteractiveAccordion>
            <InteractiveAccordion title="Yesterday">{args.children}</InteractiveAccordion>
            <InteractiveAccordion title="Last Week">{args.children}</InteractiveAccordion>
        </>
    ),
};