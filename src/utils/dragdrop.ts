export const enum RelativeDragDropPosition {
    Top = 'TOP',
    Middle = 'MIDDLE',
    Bottom = 'BOTTOM',
}

export const relativeDragDropPosition = (
    event: React.DragEvent<HTMLElement>,
    verticalZoneThreshold: number, // divide drop target into top, middle and bottom section
): RelativeDragDropPosition => {
    const draggedPositionY = event.clientY;
    const targetRect = (event.target as HTMLDivElement).getBoundingClientRect();

    const relativeY = (draggedPositionY - targetRect.top) / targetRect.height;

    if (relativeY <= verticalZoneThreshold) {
        return RelativeDragDropPosition.Top;
    }

    if (relativeY >= 1 - verticalZoneThreshold) {
        return RelativeDragDropPosition.Bottom;
    }

    return RelativeDragDropPosition.Middle;
};
