import { createProxyStore } from '../store/reduxBridge';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { OptionsPage } from './OptionsPage';

const { storePromise } = createProxyStore();

storePromise.then((store) => {
    const container = document.getElementById('options-root');

    const root = createRoot(container!);

    root.render(
        <Provider store={store}>
            <OptionsPage />
        </Provider>,
    );
});