import { Point } from '../../../store/slices/session';

// TODO find a more robust way to determine menu height
// find DOM node in useLayoutEffect and use getBoundingClientRect?
const contextMenuHeight = 64; // 2 menu items, each 32px
const menuWidthInPx = 200; // TODO use custom property?

export const menuPosition = (
    e: { clientX: number; clientY: number },
    width: number | undefined,
    height: number | undefined,
): Point | undefined => {
    if (width === undefined || height === undefined) {
        return undefined;
    }

    const x = width - e.clientX < menuWidthInPx ? width - menuWidthInPx : e.clientX;
    const y = height - e.clientY < contextMenuHeight ? height - contextMenuHeight : e.clientY;

    return { x, y };
};
