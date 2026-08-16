import React from 'react';
import type { Decorator } from '@storybook/react-webpack5';

import { RootState } from '../store/store';
import { MockStoreProvider } from './mockStore';
import { stateFixture } from './fixtures';

/** Provides a redux store to stories of components that use `useAppSelector` / `useAppDispatch`. */
export const withStore = (preloadedState: Partial<RootState> = stateFixture): Decorator => {
    const WithStore: Decorator = (Story) => (
        <MockStoreProvider preloadedState={preloadedState}>
            <Story />
        </MockStoreProvider>
    );

    return WithStore;
};

/** Renders a story inside a container that mimics the sidebar (width, colors, positioning context). */
export const withSidebarFrame: Decorator = (Story) => (
    <div className="sidebar__container storybook-sidebar-frame">
        <Story />
    </div>
);
