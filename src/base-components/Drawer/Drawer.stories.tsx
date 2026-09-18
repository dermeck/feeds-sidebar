import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Drawer } from './Drawer';
import { withSidebarFrame } from '../../storybook/decorators';

const meta = {
    title: 'base-components/Drawer',
    component: Drawer,
    decorators: [withSidebarFrame],
    args: {
        visible: true,
        children: <div style={{ padding: '0.5rem' }}>Drawer content (e.g. the subscribe view)</div>,
    },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

const DrawerInteractiveDemo = ({ children }: { children: React.ReactNode }) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', position: 'relative', zIndex: 1 }}>
                <button type="button" onClick={() => setVisible(true)}>
                    Show drawer
                </button>
                <button type="button" onClick={() => setVisible(false)} disabled={!visible}>
                    Hide drawer
                </button>
            </div>
            <div style={{ padding: '0.5rem' }}>Feed list content behind the drawer.</div>
            <Drawer visible={visible}>{children}</Drawer>
        </>
    );
};


export const Interactive: Story = {
    render: (args) => <DrawerInteractiveDemo>{args.children}</DrawerInteractiveDemo>,
};
