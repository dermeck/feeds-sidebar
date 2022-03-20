import '../wdyr';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from '../sidebar/App';
import store from '../store/store';

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('stand-alone-root'),
);
