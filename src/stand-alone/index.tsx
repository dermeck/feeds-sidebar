import '../wdyr';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from '../sidebar/App';
import store from '../store/store';

const container = document.getElementById('stand-alone-root');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
    <Provider store={store}>
        <App />
    </Provider>,
);
