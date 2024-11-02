import React, { useState } from 'react';
import { FunctionComponent } from 'react';

import Menu from './Menu/Menu';
import Sidebar from './Sidebar';

export const enum View {
    feedList = 'feedList',
    subscribe = 'subscribe',
}

const App: FunctionComponent = () => {
    const [activeView, setActiveView] = useState<View>(View.feedList);

    return (
        <React.StrictMode>
            <Sidebar activeView={activeView} changeView={setActiveView} />
            <Menu changeView={setActiveView} />
        </React.StrictMode>
    );
};

export default App;
