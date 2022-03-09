export const colors = {
    // Canvas?
    defaultBackgroundColor: '#FFFFFF',

    // ????
    defaultColor: '#38383d',

    // Highlight
    //highlightBackgroundColor1: '#48b9c7',
    highlightColor1Light: '#FFFFFF',

    //-moz-DialogText rgb(41,41,41)
    highlightColor1Dark: '#292929',

    // -moz-CellHighlight #e1e1e1 -moz-html-CellHighlight
    highlightBackgroundColorNoFocus: '#E2E2E2',

    // ButtonFace #e9e9ed
    menuBorder: '#D4D4D4',

    // -moz-DialogText rgb(41,41,41) #292929
    toolbarFont: '#292929',

    // -moz-Dialog
    toolbarBackground: '#F6F6F6',

    // currentcolor 17% (41,41,41)
    toolbarButtonHoverBackground: '#D4D4D4',

    // rgba(41, 41, 41, 0.3) // current color 30% -moz-DialogText
    toolbarButtonActiveBackground: '#B8B8B8',

    badgeBackgroundColor: '#DD2E44',
    badgeTextColor: '#FFFFFF',
};

export const highlightBackgroundColor1 = 'Highlight';

interface RGB {
    r: number;
    g: number;
    b: number;
}

export const rgba = (hexColor: string, opacity: number): string => {
    if (opacity < 0 || opacity > 1) {
        throw new Error(`Invalid opacity '${opacity}'. Only values between 0. and 1.0 are allowed.`);
    }

    const rgb = hexToRgb(hexColor);

    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};

const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) {
        throw new Error(`Error converting hex string '${hex}' to RGB.`);
    }

    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    };
};
