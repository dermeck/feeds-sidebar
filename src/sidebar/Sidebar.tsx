/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { FunctionComponent, useState } from 'react';
import { Plus, RefreshCw } from 'react-feather';

import { Drawer, ToolbarContainer, Input, ToolbarButton } from '../components/styled';
import { useAppDispatch } from '../store/hooks';
import { fetchAllFeedsCommand } from '../store/slices/feeds';
import FeedList from './FeedList/FeedList';
import NewFeedForm from './NewFeedForm/NewFeedForm';

const SidebarContainer = styled.div`
    background-color: #fff;
    color: #38383d;
`;

const Header = styled(ToolbarContainer)`
    display: grid;
    grid-template-columns: 32px 1fr 32px;
    grid-column-gap: 4px;
    align-items: center;
`;

const FetchAllButton = styled(ToolbarButton)({
    gridColumn: '1',
    padding: '7px',
});

const NavigateToAddViewButton = styled(ToolbarButton)({
    gridColumn: '3',
});

const FilterInput = styled(Input)({
    gridColumn: '2',
});

export type View = 'feeds' | 'newFeed';

const Sidebar: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const [view, setView] = useState<View>('feeds');

    return (
        <SidebarContainer>
            <Header>
                <FetchAllButton onClick={() => dispatch(fetchAllFeedsCommand())}>
                    <RefreshCw size={18} />
                </FetchAllButton>
                <FilterInput></FilterInput>
                <NavigateToAddViewButton onClick={() => setView('newFeed')}>
                    <Plus />
                </NavigateToAddViewButton>
            </Header>
            <FeedList />

            <Drawer show={view === 'newFeed'}>
                <NewFeedForm onCancel={() => setView('feeds')} />
            </Drawer>
        </SidebarContainer>
    );
};

export default Sidebar;
