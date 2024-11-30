import { RefObject, useLayoutEffect, useState } from 'react';

export function useHasScrollbar({ ref }: { ref: RefObject<HTMLDivElement | null> }) {
    const [hasScrollbar, setHasScrollbar] = useState(false);

    useLayoutEffect(() => {
        const scrollContainer = ref?.current;

        const update = () => {
            scrollContainer && setHasScrollbar(scrollContainer.scrollHeight > scrollContainer.clientHeight);
        };

        update();

        const resizeObserver = new ResizeObserver(() => {
            update();
        });

        const mutationObserver = new MutationObserver(() => {
            update();
        });

        if (scrollContainer) {
            resizeObserver.observe(scrollContainer);
            mutationObserver.observe(scrollContainer, {
                attributes: true,
                childList: true,
                subtree: true,
            });
        }

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [ref]);

    return hasScrollbar;
}
