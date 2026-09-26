import React, { useRef, useState } from 'react';
import { ArrowsClockwise, CalendarBlank, DotsThreeOutline, List, TreeView } from '@phosphor-icons/react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeedsCommand, selectFeeds } from '../store/slices/feeds';
import optionsSlice, { selectOptions } from '../store/slices/options';
import sessionSlice, { MenuType, selectIsLoadingFeeds } from '../store/slices/session';
import { MainView } from './MainView/MainView';
import { SubscribeView } from './SubscribeView/SubscribeView';
import { DiagnosisView } from './DiagnosisView/DiagnosisView';
import { View } from './App';
import { Button } from '../base-components/Button/Button';
import { ButtonGroup } from '../base-components/ButtonGroup/ButtonGroup';
import { Drawer } from '../base-components/Drawer/Drawer';
import { Header } from '../base-components/Header/Header';
import { MessageBar } from '../base-components/MessageBar/MessageBar';
import { SearchInput } from '../base-components/SearchInput/SearchInput';
import clsx from 'clsx';
import { getCssCustomPropertyNumberValue } from '../utils/getCssCustomProperty';

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
    const mainViewDisplayMode = useAppSelector(selectOptions).mainViewDisplayMode;
    const feeds = useAppSelector((state) => selectFeeds(state.feeds));
    const isLoading = useAppSelector((state) => selectIsLoadingFeeds(state.session));
    const persistenceError = useAppSelector((state) => state.session.persistenceError);

    const [filterString, setFilterString] = useState<string>('');

    return (
        <div
            className="sidebar__container"
            onContextMenu={(e) => {
                if (urlInputRef.current !== e.target) {
                    // allow paste into url input but prevent all other context menus
                    e.preventDefault();
                }
            }}
            onBlur={() => dispatch(sessionSlice.actions.hideMenu())}
        >
            <Header className="sidebar__main-header">
                <Button
                    variant="toolbar"
                    title="Fetch all Feeds"
                    onClick={() => dispatch(fetchFeedsCommand(feeds.map((x) => x.id)))}
                >
                    <ArrowsClockwise className={clsx(isLoading && 'animation-spin')} size={18} weight="regular" />
                </Button>

                <SearchInput label="filter text" value={filterString} onChange={setFilterString} />

                <ButtonGroup>
                    <Button
                        variant="toolbar"
                        title="Show Plain List"
                        onClick={() => dispatch(optionsSlice.actions.mainViewDisplayModeChanged('plain-list'))}
                        active={mainViewDisplayMode === 'plain-list'}
                    >
                        <List size={18} />
                    </Button>

                    <Button
                        variant="toolbar"
                        title="Show Folders"
                        onClick={() => dispatch(optionsSlice.actions.mainViewDisplayModeChanged('folder-tree'))}
                        active={mainViewDisplayMode === 'folder-tree'}
                    >
                        <TreeView size={18} />
                    </Button>

                    <Button
                        variant="toolbar"
                        title="Show Date Sorted List"
                        onClick={() => dispatch(optionsSlice.actions.mainViewDisplayModeChanged('date-sorted-list'))}
                        active={mainViewDisplayMode === 'date-sorted-list'}
                    >
                        <CalendarBlank size={18} />
                    </Button>
                </ButtonGroup>

                <Button
                    variant="toolbar"
                    title="More Options"
                    active={moreMenuVisible}
                    onClick={(e) => {
                        dispatch(sessionSlice.actions.showMoreMenu(getMoreMenuCoordinates(e.currentTarget)));
                    }}
                >
                    <DotsThreeOutline size={18} weight="fill" />
                </Button>
            </Header>

            {persistenceError !== undefined && (
                <MessageBar variant="error" className="sidebar__persistence-error">
                    {persistenceError}
                </MessageBar>
            )}

            <MainView displayMode={mainViewDisplayMode} filterString={filterString.trim()} />

            <Drawer visible={activeView !== View.feedList}>
                {activeView === View.subscribe && (
                    <SubscribeView urlInputRef={urlInputRef} onClose={() => changeView(View.feedList)} />
                )}

                {activeView === View.diagnosis && <DiagnosisView onClose={() => changeView(View.feedList)} />}
            </Drawer>
        </div>
    );
};

if (process.env.MODE === 'dev') {
    Sidebar.whyDidYouRender = true;
}

export default Sidebar;
