export const colors = {
    highlightBackgroundColor1: '#48b9c7',
    highlightColor1: '#FFF',

    toolbarFont: '#292929',
    toolbarBackground: '#F6F6F6',
    toolbarButtonHoverBackground: '#D4D4D4',
    toolbarButtonActiveBackgroudn: '#B8B8B8',
};

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

    const result = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    console.log(result);

    return result;
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
