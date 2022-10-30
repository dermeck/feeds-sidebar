/** @jsx jsx */
import { jsx, ThemeProvider } from '@emotion/react';

import React from 'react';
import { FunctionComponent } from 'react';

import { darkTheme, lightTheme } from '../theme';
import usePrefersColorSchemeDark from '../utils/hooks/usePrefersColorSchemeDark';
import Menu from './Menu';
import Sidebar from './Sidebar';

const App: FunctionComponent = () => {
    const darkMode = usePrefersColorSchemeDark();

    return (
        <React.StrictMode>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <Sidebar />
                <Menu />
            </ThemeProvider>
        </React.StrictMode>
    );
};

export default App;
