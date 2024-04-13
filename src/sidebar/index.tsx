import { Store } from '../store/redux-bridge';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';

const store = new Store();

store.ready().then(() => {
    const container = document.getElementById('sidebar-root');

    const root = createRoot(container!);

    root.render(
        <Provider store={store}>
            <App />
        </Provider>,
    );
});
