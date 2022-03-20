import { Store } from 'webext-redux';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';

const store = new Store();

store.ready().then(() => {
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('sidebar-root'),
    );
});
