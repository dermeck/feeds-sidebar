import { colorKeywordToHex, rgba } from '../../utils/colorUtils';

export const colors = {
    // -moz-DialogText rgb(41,41,41) #292929
    toolbarFont: '#292929',

    // -moz-Dialog
    toolbarBackground: '#F6F6F6',

    // currentcolor 17% (41,41,41)
    toolbarButtonHoverBackground: '#D4D4D4',

    // rgba(41, 41, 41, 0.3) // current color 30% -moz-DialogText
    toolbarButtonActiveBackground: '#B8B8B8',
};

export const sidebarBackgroundColor = 'Field';
export const sideBarTextColor = 'FieldText';

export const toolbarBackgroundColor = '-moz-Dialog';
export const toolbarTextColor = '-moz-DialogText';
export const toolbarButtonHoverBackground = rgba(colorKeywordToHex(toolbarTextColor), 0.17);
export const toolbarButtonActiveBackground = rgba(colorKeywordToHex(toolbarTextColor), 0.3);

export const selectedItemBackgroundColor = 'SelectedItem';
export const selectedItemTextColor = 'SelectedItemText';
export const selectedItemNoFocusBackgroundColor = '-moz-CellHighlight';
export const selectedItemNoFocusTextColor = '-moz-CellHighlightText';

export const menuHoverBackgroundColor = '-moz-MenuHover';
export const menuHoverTextColor = '-moz-MenuHoverText';
export const menuBorderColor = 'ButtonFace';

export const messageBackgroundColor = '-moz-CellHighlight'; // TODO reevaluate if this is appropiate
export const messageTextColor = '-moz-CellHighlightText';
