import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { menuWidthInPx } from '../../base-components/styled/Menu';
import sessionSlice from '../../store/slices/session';
import useWindowDimensions from '../../utils/hooks/useWindowDimensions';

// TODO find a more robust way to determine menu height
// find DOM node in useLayoutEffect and use getBoundingClientRect?
const contextMenuHeight = 64; // 2 menu items, each 32px

export const useContextMenu = (containerRef: React.RefObject<HTMLDivElement>) => {
    const { height, width } = useWindowDimensions();
    const dispatch = useDispatch();

    const handleContextMenuFolder = useCallback((event: Event) => {
        const e = event as MouseEvent;
        e.preventDefault();

        if (width === undefined || height === undefined) {
            console.error('Could not open context menu. Unable to determine dimensions of window.');
            return;
        }

        const x = width - e.clientX < menuWidthInPx ? width - menuWidthInPx : e.clientX;
        const y = height - e.clientY < contextMenuHeight ? height - contextMenuHeight : e.clientY;

        dispatch(sessionSlice.actions.showContextMenu({ x, y }));
    }, []);

    useEffect(() => {
        containerRef.current?.addEventListener('contextmenu', handleContextMenuFolder);

        return () => containerRef.current?.removeEventListener('contextmenu', handleContextMenuFolder);
    }, []);
};
