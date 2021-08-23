/// <reference types="@welldone-software/why-did-you-render" />

/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';

if (process.env.NODE_ENV === 'development') {
    console.log('wdyr');
    // react-redux/lib because:
    // https://github.com/welldone-software/why-did-you-render/issues/154#issuecomment-773905769
    const ReactRedux = require('react-redux/lib');
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
        trackAllPureComponents: true,
        trackExtraHooks: [[ReactRedux, 'useSelector']],
    });
}
