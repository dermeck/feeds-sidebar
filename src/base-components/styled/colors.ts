import { colorKeywordToHex, rgba } from '../../utils/colorUtils';

export const sidebarBackgroundColor = 'Field'; // TODO adapt for dark mode (Canvas)
export const sideBarTextColor = 'FieldText';

export const buttonBackgroundColor = 'ButtonFace';
export const buttonTextColor = 'ButtonText';
export const buttonHoverBackgroundColor = '-moz-ButtonHoverFace';
export const buttonHoverTextColor = '-moz-ButtonHoverText';
export const buttonActiveBackgroundColor = '-moz-ButtonHoverFace';
export const buttonActiveTextColor = '-moz-ButtonHoverText';

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

export const messageBackgroundColor = '-moz-Dialog';
export const messageTextColor = '-moz-DialogText';
