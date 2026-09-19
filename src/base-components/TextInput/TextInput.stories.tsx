import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { TextInput } from './TextInput';
import { withNarrowContainer } from '../../storybook/decorators';

const TextInputDemo = (props: React.ComponentProps<typeof TextInput>) => {
    const [value, setValue] = useState('');

    return <TextInput {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};

const meta = {
    title: 'base-components/TextInput',
    component: TextInput,
    decorators: [withNarrowContainer],
    args: {
        label: 'Folder name',
        value: '',
        onChange: () => undefined,
    },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { placeholder: 'New Folder' },
};

export const Disabled: Story = {
    args: { value: 'News', disabled: true },
};

export const Interactive: Story = {
    args: { placeholder: 'New Folder' },
    render: (args) => <TextInputDemo {...args} />,
};