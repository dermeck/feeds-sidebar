import '@emotion/react';

declare module '@emotion/react' {
    export interface Theme {
        colors: {
            sidebarBackground: string;
            sideBarText: string;

            buttonBackgroundColor: string;
            buttonTextColor: string;
            buttonHoverBackgroundColor: string;
            buttonHoverTextColor: string;
            buttonActiveBackgroundColor: string;
            buttonActiveTextColor: string;

            toolbarBackgroundColor: string;
            toolbarTextColor: string;
            toolbarButtonHoverBackground: string;
            toolbarButtonActiveBackground: string;

            selectedItemBackgroundColor: string;
            selectedItemTextColor: string;
            selectedItemNoFocusBackgroundColor: string;
            selectedItemNoFocusTextColor: string;

            menuHoverBackgroundColor: string;
            menuHoverTextColor: string;
            menuBorderColor: string;

            messageBackgroundColor: string;
            messageTextColor: string;
        };
        folderIconSize: number;
        toggleIndicatorSize: number;
        iconRightSpacing: number;
        spacerHeight: number;
    }
}
