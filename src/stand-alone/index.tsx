import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Menu from '../sidebar/Menu/Menu';
import Sidebar from '../sidebar/Sidebar';
import store from '../store/store';

render(
    <Provider store={store}>
        <Sidebar />
        <Menu />
    </Provider>,
    document.getElementById('stand-alone-root'),
);
