/** @jsx jsx */
import { jsx, ThemeProvider } from '@emotion/react';

import React, { useState } from 'react';
import { FunctionComponent } from 'react';

import { darkTheme, lightTheme } from '../theme';
import usePrefersColorSchemeDark from '../utils/hooks/usePrefersColorSchemeDark';
import Menu from './Menu';
import Sidebar from './Sidebar';

export const enum View {
    feedList = 'feedList',
    subscribe = 'subscribe',
}

const App: FunctionComponent = () => {
    const darkMode = usePrefersColorSchemeDark();
    const [activeView, setActiveView] = useState<View>(View.feedList);

    return (
        <React.StrictMode>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <Sidebar activeView={activeView} changeView={setActiveView} />
                <Menu changeView={setActiveView} />
            </ThemeProvider>
        </React.StrictMode>
    );
};

export default App;
