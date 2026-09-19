import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { SearchInput } from './SearchInput';
import { withNarrowContainer } from '../../storybook/decorators';

type SearchInputDemoProps = React.ComponentProps<typeof SearchInput> & { initialValue?: string };

const SearchInputDemo = ({ initialValue = '', ...props }: SearchInputDemoProps): React.JSX.Element => {
    const [value, setValue] = useState(initialValue);

    return <SearchInput {...props} value={value} onChange={setValue} />;
};

const meta = {
    title: 'base-components/SearchInput',
    component: SearchInput,
    decorators: [withNarrowContainer],
    args: {
        label: 'Filter',
        value: '',
        onChange: () => undefined,
    },
} satisfies Meta<typeof SearchInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { placeholder: 'Filter…' } };

export const WithValue: Story = {
    args: { value: 'faster', placeholder: 'Filter…' },
    render: (args) => <SearchInputDemo {...args} initialValue={args.value} />,
};

export const Interactive: Story = {
    args: { placeholder: 'Filter…' },
    render: (args) => <SearchInputDemo {...args} />,
};