import { ProxyStore } from '../store/redux-bridge';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Store as ReduxStore } from '@reduxjs/toolkit';

import App from './App';
import { UnknownAction } from '@reduxjs/toolkit';

const store = new ProxyStore();

store.ready().then(() => {
    const container = document.getElementById('sidebar-root');

    const root = createRoot(container!);

    // TODO fix typing
    root.render(
        <Provider store={store as ReduxStore<unknown, UnknownAction, unknown>}>
            <App />
        </Provider>,
    );
});
