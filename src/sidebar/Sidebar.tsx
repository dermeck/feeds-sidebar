/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';

import { FunctionComponent, useRef, useState } from 'react';
import { Folder, MoreHorizontal, RefreshCw } from 'react-feather';

import { Drawer, ToolbarContainer, Input, ToolbarButton } from '../base-components';
import { menuWidthInPx } from '../base-components/styled/Menu';
import { toolbarButtonPaddingInPx, toolbarButtonSideLengthInPx } from '../base-components/styled/ToolbarButton';
import { colors } from '../base-components/styled/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeedsCommand } from '../store/slices/feeds';
import sessionSlice, { MenuType, View } from '../store/slices/session';
import FeedList from './FeedList';
import NewFeedForm from './NewFeedForm';

const SidebarContainer = styled.div`
    background-color: ${colors.defaultBackgroundColor};
    color: ${colors.defaultColor};
`;

const Header = styled(ToolbarContainer)`
    display: grid;
    align-items: center;
    grid-column-gap: 4px;
    grid-template-columns: 32px 1fr 32px 32px;
`;

const FetchAllButton = styled(ToolbarButton)({
    gridColumn: '1',
    padding: '7px',
});

const ShowFeedTitleButton = styled(ToolbarButton)({
    gridColumn: '3',
    padding: '7px',
});

const MoreMenuButton = styled(ToolbarButton)({
    gridColumn: '4',
});

const FilterInput = styled(Input)({
    gridColumn: '2',
});

const Sidebar: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const urlInputRef = useRef<HTMLInputElement>(null);

    const moreMenuVisible = useAppSelector((state) => state.session.menuContext?.type === MenuType.moreMenu);
    const activeView = useAppSelector((state) => state.session.activeView);
    const feeds = useAppSelector((state) => state.feeds.feeds);

    const [showFolders, setShowFeedTitles] = useState<boolean>(true);
    const [filterString, setFilterString] = useState<string>('');

    return (
        <SidebarContainer
            onContextMenu={(e) => {
                if (urlInputRef.current !== e.target) {
                    e.preventDefault();
                }
            }}
            onBlur={() => dispatch(sessionSlice.actions.hideMenu())}>
            <Header>
                <FetchAllButton onClick={() => dispatch(fetchFeedsCommand(feeds.map((x) => x.url)))}>
                    <RefreshCw size={18} />
                </FetchAllButton>

                <FilterInput value={filterString} onChange={(e) => setFilterString(e.target.value)} />

                <ShowFeedTitleButton onClick={() => setShowFeedTitles(!showFolders)} active={showFolders}>
                    <Folder size={18} />
                </ShowFeedTitleButton>

                <MoreMenuButton active={moreMenuVisible}>
                    <MoreHorizontal
                        onClick={(e) => {
                            const offsetHeight = e.currentTarget.parentElement?.offsetHeight;
                            const offsetLeft = e.currentTarget.parentElement?.offsetLeft;

                            if (offsetHeight !== undefined && offsetLeft !== undefined) {
                                dispatch(
                                    sessionSlice.actions.showMoreMenu({
                                        x: offsetLeft - menuWidthInPx + toolbarButtonSideLengthInPx,
                                        y: offsetHeight + 2 * toolbarButtonPaddingInPx,
                                    }),
                                );
                            }
                        }}
                    />
                </MoreMenuButton>
            </Header>
            <FeedList showFeedTitles={showFolders && filterString.trim() === ''} filterString={filterString.trim()} />

            <Drawer show={activeView === View.subscribe}>
                <NewFeedForm urlInputRef={urlInputRef} />
            </Drawer>
        </SidebarContainer>
    );
};

if (process.env.MODE === 'dev') {
    Sidebar.whyDidYouRender = true;
}

export default Sidebar;
