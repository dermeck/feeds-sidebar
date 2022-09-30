export const enum RelativeDragDropPosition {
    Top = 'TOP',
    Middle = 'MIDDLE',
    Bottom = 'BOTTOM',
}

// divide the drop target to 15% top, 70% middle, 15% bottom
const verticalZoneThreshold = 0.15;

export const relativeDragDropPosition = (event: React.DragEvent<HTMLElement>): RelativeDragDropPosition => {
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
