import React, { useEffect, useRef } from 'react';
import type { Decorator } from '@storybook/react-webpack5';

import { RootState } from '../store/store';
import { MockStoreProvider } from './mockStore';
import { stateFixture } from './fixtures';

/** Provides a redux store to stories of components that use `useAppSelector` / `useAppDispatch`. */
export const withStore = (preloadedState: Partial<RootState> = stateFixture): Decorator => {
    const WithStore: Decorator = (Story) => {
        useEffect(() => {
            // native dialogs block the storybook iframe/are suppressed by the browser
            const originalConfirm = window.confirm;

            window.confirm = () => true;

            return () => {
                window.confirm = originalConfirm;
            };
        }, []);

        return (
            <MockStoreProvider preloadedState={preloadedState}>
                <Story />
            </MockStoreProvider>
        );
    };

    return WithStore;
};

/** Renders a story inside a container that mimics the sidebar (width, colors, positioning context). */
export const withSidebarFrame: Decorator = (Story) => {
    const SidebarFrame = () => {
        const frameRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const frame = frameRef.current;
            if (frame === null) {
                return;
            }

            // links (feed items, diagnosis rows) must not navigate the storybook iframe away
            const preventLinkNavigation = (event: Event) => {
                if (event.target instanceof Element && event.target.closest('a') !== null) {
                    event.preventDefault();
                }
            };

            frame.addEventListener('click', preventLinkNavigation, true);
            frame.addEventListener('auxclick', preventLinkNavigation, true);

            return () => {
                frame.removeEventListener('click', preventLinkNavigation, true);
                frame.removeEventListener('auxclick', preventLinkNavigation, true);
            };
        }, []);

        return (
            <div className="sidebar__container storybook-sidebar-frame" ref={frameRef}>
                <Story />
            </div>
        );
    };

    return <SidebarFrame />;
};