export const enum RelativeDropPosition {
    Top = 'TOP',
    Middle = 'MIDDLE',
    Bottom = 'BOTTOM',
}

export const relativeDropPosition = () => {
    // TODO determine relative position of dragged node
    return RelativeDropPosition.Middle;
};
