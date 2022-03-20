import { Theme } from '@emotion/react';

import { colorKeywordToHex, rgba } from '../utils/colorUtils';

const baseTheme: Theme = {
    colors: {
        sidebarBackground: 'Field',
        sideBarText: 'FieldText',

        buttonBackgroundColor: 'ButtonFace',
        buttonTextColor: 'ButtonText',
        buttonHoverBackgroundColor: '-moz-ButtonHoverFace',
        buttonHoverTextColor: '-moz-ButtonHoverText',
        buttonActiveBackgroundColor: '-moz-ButtonHoverFace',
        buttonActiveTextColor: '-moz-ButtonHoverText',

        toolbarBackgroundColor: '-moz-Dialog',
        toolbarTextColor: '-moz-DialogText',
        toolbarButtonHoverBackground: rgba(colorKeywordToHex('-moz-DialogText'), 0.17),
        toolbarButtonActiveBackground: rgba(colorKeywordToHex('-moz-DialogText'), 0.3),

        selectedItemBackgroundColor: 'SelectedItem',
        selectedItemTextColor: 'SelectedItemText',
        selectedItemNoFocusBackgroundColor: '-moz-CellHighlight',
        selectedItemNoFocusTextColor: '-moz-CellHighlightText',

        menuHoverBackgroundColor: '-moz-MenuHover',
        menuHoverTextColor: '-moz-MenuHoverText',
        menuBorderColor: 'ButtonFace',

        messageBackgroundColor: '-moz-Dialog',
        messageTextColor: '-moz-DialogText',
    },
};

export const lightTheme = baseTheme;

export const darkTheme: Theme = {
    ...baseTheme,
    // Firefox uses Field and FieldText in #sidebar-box but passes different value for the dark mode :/
    // (Bookmarks get a different color value)
    colors: {
        ...baseTheme.colors,
        sidebarBackground: 'Canvas',
        sideBarText: 'CanvasText',
    },
};
