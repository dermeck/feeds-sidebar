import { createProxyStore } from '../store/reduxBridge';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';

const { readyPromise, store } = createProxyStore();

readyPromise.then(() => {
    const container = document.getElementById('sidebar-root');

    const root = createRoot(container!);

    root.render(
        <Provider store={store}>
            <App />
        </Provider>,
    );
});
