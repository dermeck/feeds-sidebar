import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { SearchInput } from './SearchInput';

type SearchInputDemoProps = React.ComponentProps<typeof SearchInput> & { initialValue?: string };

const SearchInputDemo = ({ initialValue = '', ...props }: SearchInputDemoProps): React.JSX.Element => {
    const [value, setValue] = useState(initialValue);

    return <SearchInput {...props} value={value} onChange={setValue} />;
};

const meta = {
    title: 'base-components/SearchInput',
    component: SearchInput,
    args: {
        label: 'Filter',
        value: '',
        onChange: () => undefined,
    },
} satisfies Meta<typeof SearchInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Empty input with a magnifying glass icon. */
export const Empty: Story = { args: { placeholder: 'Filter…' } };

/** A clear button appears once text is entered. */
export const WithValue: Story = {
    args: { value: 'faster', placeholder: 'Filter…' },
    render: (args) => <SearchInputDemo {...args} initialValue={args.value} />,
};

/** Typing updates the value through the onChange callback. */
export const Interactive: Story = {
    args: { placeholder: 'Filter…' },
    render: (args) => <SearchInputDemo {...args} />,
};