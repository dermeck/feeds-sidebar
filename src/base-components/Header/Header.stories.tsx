import React, { useState } from 'react';
import { ArrowLeft, ArrowsClockwise, DotsThreeOutline } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Button } from '../Button/Button';
import { SearchInput } from '../SearchInput/SearchInput';
import { Header } from './Header';

/** The filter state is controlled by the parent, here by local state. */
const FilteredHeader = ({ filterString }: { filterString: string }) => {
    const [filter, setFilter] = useState(filterString);

    return (
        <Header className="sidebar__main-header">
            <Button variant="toolbar" title="Fetch all Feeds">
                <ArrowsClockwise size={22} />
            </Button>
            <SearchInput label="filter text" value={filter} onChange={setFilter} placeholder="Filter…" />
            <Button variant="toolbar" title="More Options">
                <DotsThreeOutline size={22} weight="fill" />
            </Button>
        </Header>
    );
};

const meta = {
    title: 'base-components/Header',
    component: Header,
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Header of the subscribe view (back button and title). */
export const WithTitle: Story = {
    args: {
        children: (
            <>
                <Button variant="toolbar" title="Back to Feed List">
                    <ArrowLeft size={22} />
                </Button>
                <h1 className="subscribe-view__title">Add New Feed</h1>
            </>
        ),
    },
};

/** Toolbar header of the sidebar (fetch button, filter input and more menu button). */
export const MainHeader: Story = {
    args: { children: undefined },
    render: () => <FilteredHeader filterString="" />,
};

/** The filter input is pre-filled with the current filter string. */
export const MainHeaderFiltered: Story = {
    args: { children: undefined },
    render: () => <FilteredHeader filterString="faster" />,
};
