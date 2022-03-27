interface RGB {
    r: number;
    g: number;
    b: number;
}

export const colorKeywordToHex = (colorKeyword: string) => {
    const canvasContext = document.createElement('canvas').getContext('2d');

    if (!canvasContext) {
        throw new Error(
            `Could convert color keyword "${colorKeyword}" to its hex representation. Canvas 2d context is null.`,
        );
    }

    canvasContext.fillStyle = colorKeyword;

    return canvasContext.fillStyle;
};

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
