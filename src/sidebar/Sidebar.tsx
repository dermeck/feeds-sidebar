/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { ArrowsClockwise, FolderSimple, DotsThreeOutline } from 'phosphor-react';

import { useRef, useState } from 'react';

import { Drawer } from '../base-components';
import { menuWidthInPx } from '../base-components/styled/Menu';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeedsCommand, selectFeeds } from '../store/slices/feeds';
import optionsSlice, { selectOptions } from '../store/slices/options';
import sessionSlice, { MenuType, selectIsLoadingFeeds } from '../store/slices/session';
import FeedList from './FeedList';
import NewFeedForm from './NewFeedForm';
import { View } from './App';
import { Button } from '../base-components/Button/Button';
import { Header } from '../base-components/Header/Header';
import clsx from 'clsx';

const toolbarButtonSideLengthInPx = 32;
const toolbarButtonPaddingInPx = 4; // TODO mr this should be 5?

const SidebarContainer = styled.div`
    background-color: ${(props) => props.theme.colors.sidebarBackground};
    color: ${(props) => props.theme.colors.sideBarText};
`;

type SideBarProps = {
    activeView: View;
    changeView: (value: View) => void;
};

const Sidebar = ({ activeView, changeView }: SideBarProps) => {
    const dispatch = useAppDispatch();
    const urlInputRef = useRef<HTMLInputElement>(null);

    const moreMenuVisible = useAppSelector(
        (state) => state.session.menuContext?.type === MenuType.moreMenu && state.session.menuVisible,
    );
    const showFeedTitles = useAppSelector(selectOptions).showFeedTitles;
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
            <Header className="main__header">
                <Button
                    variant="toolbar"
                    title="Fetch all Feeds"
                    onClick={() => dispatch(fetchFeedsCommand(feeds.map((x) => x.id)))}>
                    <ArrowsClockwise className={clsx(isLoading && 'animation-spin')} size={22} weight="regular" />
                </Button>

                <input value={filterString} onChange={(e) => setFilterString(e.target.value)} />

                <Button
                    variant="toolbar"
                    title="Toggle Show Folders"
                    onClick={() => dispatch(optionsSlice.actions.toggleShowFeedTitles())}
                    active={showFeedTitles}>
                    <FolderSimple size={22} />
                </Button>

                <Button
                    variant="toolbar"
                    title="More Options"
                    active={moreMenuVisible}
                    onClick={(e) => {
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
                </Button>
            </Header>

            <FeedList
                showFeedTitles={showFeedTitles && filterString.trim() === ''}
                filterString={filterString.trim()}
            />

            <Drawer visible={activeView !== View.feedList}>
                {activeView === View.subscribe && (
                    <NewFeedForm urlInputRef={urlInputRef} onClose={() => changeView(View.feedList)} />
                )}
            </Drawer>
        </SidebarContainer>
    );
};

if (process.env.MODE === 'dev') {
    Sidebar.whyDidYouRender = true;
}

export default Sidebar;
