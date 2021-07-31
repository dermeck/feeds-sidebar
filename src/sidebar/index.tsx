import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';

import ContextMenu from './ContextMenu';
import Sidebar from './Sidebar';

const store = new Store();

store.ready().then(() => {
    render(
        <Provider store={store}>
            <Sidebar />
            <ContextMenu />
        </Provider>,
        document.getElementById('sidebar-root'),
    );
});
