/// <reference types="@welldone-software/why-did-you-render" />

/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';

if (process.env.NODE_ENV === 'development') {
    // https://github.com/welldone-software/why-did-you-render/issues/85#issuecomment-590076401
    //const ReactRedux = require('react-redux/dist/react-redux.js');
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
        trackAllPureComponents: true,
        // trackExtraHooks: [[ReactRedux, 'useSelector']], // TODO check if this works
    });
}
