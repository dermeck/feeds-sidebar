/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { ArrowsClockwise, FolderSimple, DotsThreeOutline } from 'phosphor-react';

import { FunctionComponent, useRef, useState } from 'react';

import { Drawer, ToolbarContainer, Input, ToolbarButton } from '../base-components';
import { menuWidthInPx } from '../base-components/styled/Menu';
import { toolbarButtonPaddingInPx, toolbarButtonSideLengthInPx } from '../base-components/styled/ToolbarButton';
import { spin } from '../base-components/styled/animations';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeedsCommand, selectFeeds } from '../store/slices/feeds';
import optionsSlice, { selectOptions } from '../store/slices/options';
import sessionSlice, { MenuType, selectIsLoadingFeeds, View } from '../store/slices/session';
import FeedList from './FeedList';
import NewFeedForm from './NewFeedForm';
import { log } from '../store/actions';

const SidebarContainer = styled.div`
    background-color: ${(props) => props.theme.colors.sidebarBackground};
    color: ${(props) => props.theme.colors.sideBarText};
`;

const Header = styled(ToolbarContainer)`
    display: grid;
    align-items: center;
    grid-column-gap: 4px;
    grid-template-columns: 32px 1fr 32px 32px;
`;

const FetchAllButton = styled(ToolbarButton)({
    gridColumn: '1',
    padding: '5px',
});

const ShowFeedTitleButton = styled(ToolbarButton)({
    gridColumn: '3',
    padding: '5px',
});

const MoreMenuButton = styled(ToolbarButton)({
    gridColumn: '4',
});

const FilterInput = styled(Input)({
    gridColumn: '2',
    width: '100%',
});

const FetchAllButtonIcon = styled(ArrowsClockwise, {
    // prevent "Warning: Received `true` for a non-boolean attribute `spin`."
    shouldForwardProp: (props) => props !== 'spin',
})<{ spin: boolean }>`
    animation: ${(props) => (props.spin ? spin : 'none')};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`;

const Sidebar: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const urlInputRef = useRef<HTMLInputElement>(null);
    const moreMenuVisible = useAppSelector(
        (state) => state.session.menuContext?.type === MenuType.moreMenu && state.session.menuVisible,
    );
    const showFeedTitles = useAppSelector(selectOptions).showFeedTitles;
    const activeView = useAppSelector((state) => state.session.activeView);
    const feeds = useAppSelector((state) => selectFeeds(state.feeds));
    const isLoading = useAppSelector((state) => selectIsLoadingFeeds(state.session));

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
                <FetchAllButton
                    title="Fetch all Feeds"
                    onClick={() => dispatch(fetchFeedsCommand(feeds.map((x) => x.id)))}>
                    <FetchAllButtonIcon size={22} weight="regular" spin={isLoading} />
                </FetchAllButton>

                <FilterInput value={filterString} onChange={(e) => setFilterString(e.target.value)} />

                <ShowFeedTitleButton
                    title="Toggle Show Folders"
                    onClick={() => dispatch(optionsSlice.actions.toggleShowFeedTitles())}
                    active={showFeedTitles}>
                    <FolderSimple size={22} />
                </ShowFeedTitleButton>

                <MoreMenuButton
                    title="More Options"
                    active={moreMenuVisible}
                    onClick={(e) => {
                        // TODO fix issues/204
                        dispatch(log(`MoreMenu clicked: ${e.target}`)); // TODO
                        const offsetHeight = e.currentTarget.offsetHeight;
                        const offsetLeft = e.currentTarget.offsetLeft;

                        if (offsetHeight !== undefined && offsetLeft !== undefined) {
                            dispatch(
                                sessionSlice.actions.showMoreMenu({
                                    x: offsetLeft - menuWidthInPx + toolbarButtonSideLengthInPx,
                                    y: offsetHeight + 2 * toolbarButtonPaddingInPx,
                                }),
                            );
                        }
                    }}>
                    <DotsThreeOutline size={22} weight="fill" />
                </MoreMenuButton>
            </Header>

            <FeedList
                showFeedTitles={showFeedTitles && filterString.trim() === ''}
                filterString={filterString.trim()}
            />

            <Drawer visible={activeView === View.subscribe}>
                <NewFeedForm urlInputRef={urlInputRef} />
            </Drawer>
        </SidebarContainer>
    );
};

if (process.env.MODE === 'dev') {
    Sidebar.whyDidYouRender = true;
}

export default Sidebar;
