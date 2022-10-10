import { Store } from 'webext-redux';

import React from 'react';
import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';

const store = new Store();

// TODO https://github.com/tshaddix/webext-redux/issues/280
// App break on useSelector "Uncaught TypeError: can't access property "state", this is undefined"

store.ready().then(() => {
    console.log('store ready', store);
    console.log('state', store.getState());
    // https://github.com/reduxjs/react-redux/blob/master/src/hooks/useSelector.ts
    //     const { store, subscription, getServerState } = useReduxContext()! ?
    // https://react-redux.js.org/api/hooks#custom-context
    // https://github.com/reduxjs/react-redux/blob/master/src/utils/Subscription.ts
    const container = document.getElementById('sidebar-root');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const root = createRoot(container!);

    root.render(
        <Provider store={store}>
            <App />
        </Provider>,
    );
});
