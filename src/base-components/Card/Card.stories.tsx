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

export const Default: Story = {};


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

export const AccordionStack: Story = {
    render: (args) => (
        <>
            <InteractiveAccordion title="Today">{args.children}</InteractiveAccordion>
            <InteractiveAccordion title="Yesterday">{args.children}</InteractiveAccordion>
            <InteractiveAccordion title="Last Week">{args.children}</InteractiveAccordion>
        </>
    ),
};