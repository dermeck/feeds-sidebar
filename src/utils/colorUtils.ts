interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

export const resolveColorKeyword = (colorKeyword: string) => {
    const canvasContext = document.createElement('canvas').getContext('2d');

    if (!canvasContext) {
        throw new Error(
            `Could not convert color keyword "${colorKeyword}" to its hex representation. Canvas 2d context is null.`,
        );
    }

    canvasContext.fillStyle = colorKeyword;

    return canvasContext.fillStyle;
};

export const rgba = (color: string, opacity: number): string => {
    if (opacity < 0 || opacity > 1) {
        throw new Error(`Invalid opacity '${opacity}'. Only values between 0. and 1.0 are allowed.`);
    }

    const rgba = hexToRgba(color) ?? parseRgba(color);

    if (rgba === undefined) {
        throw new Error(`Failed to parse color code: '${color}'`);
    }

    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a * opacity})`;
};

const hexToRgba = (hex: string): RGBA | undefined => {
    const matches = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!matches) {
        return undefined;
    }

    return {
        r: parseInt(matches[1], 16),
        g: parseInt(matches[2], 16),
        b: parseInt(matches[3], 16),
        a: 1,
    };
};

const parseRgba = (rgbaStr: string): RGBA | undefined => {
    const matches = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([01]?\.?\d*)\s*\)$/.exec(rgbaStr);

    if (!matches) {
        return undefined;
    }

    return {
        r: parseInt(matches[1], 10),
        g: parseInt(matches[2], 10),
        b: parseInt(matches[3], 10),
        a: parseFloat(matches[4]),
    };
};
