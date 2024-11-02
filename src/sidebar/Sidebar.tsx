import React, { useRef, useState } from 'react';
import { ArrowsClockwise, FolderSimple, DotsThreeOutline } from 'phosphor-react';
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
import { getCssCustomPropertyNumberValue } from '../utils/getCssCustomProperty';
import { Drawer } from '../base-components/Drawer/Drawer';

const getMoreMenuCoordinates = (target: HTMLButtonElement): { x: number; y: number } => {
    // target offset is the top left corner of the button

    // end of menu should fit end of the button
    const menuWidth = getCssCustomPropertyNumberValue('--menu-width');
    const x = target.offsetLeft + target.clientWidth - menuWidth;

    // menu should be positioned at the bottom of the button
    // so we need to calculatate the gap between the top of the container (header) and the top of the button
    const headerHeight = getCssCustomPropertyNumberValue('--header-height');
    const y = target.offsetHeight + (headerHeight - target.clientHeight) / 2;

    return { x, y };
};

type SideBarProps = {
    activeView: View;
    changeView: (value: View) => void;
};

const Sidebar = ({ activeView, changeView }: SideBarProps) => {
    const dispatch = useAppDispatch();
    const urlInputRef = useRef<HTMLInputElement>(null);

    // TODO mr move this to local state
    const moreMenuVisible = useAppSelector(
        (state) => state.session.menuContext?.type === MenuType.moreMenu && state.session.menuVisible,
    );
    const showFeedTitles = useAppSelector(selectOptions).showFeedTitles;
    const feeds = useAppSelector((state) => selectFeeds(state.feeds));
    const isLoading = useAppSelector((state) => selectIsLoadingFeeds(state.session));

    const [filterString, setFilterString] = useState<string>('');

    return (
        <div
            className="siderbar__container"
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

                <input
                    aria-label="filter text"
                    className="text-input"
                    value={filterString}
                    onChange={(e) => setFilterString(e.target.value)}
                />

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
                        dispatch(sessionSlice.actions.showMoreMenu(getMoreMenuCoordinates(e.currentTarget)));
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
        </div>
    );
};

if (process.env.MODE === 'dev') {
    Sidebar.whyDidYouRender = true;
}

export default Sidebar;
