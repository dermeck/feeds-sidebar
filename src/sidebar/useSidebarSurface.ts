import { CSSProperties, useEffect, useState } from 'react';

import { useAppSelector } from '../store/hooks';
import { selectOptions } from '../store/slices/options';
import { getPlatformOs } from '../utils/platform';

/**
 * Resolves the sidebar background option to the platform values that sidebar-styles.css keys on.
 *
 * Arbitrary colors cannot be expressed as attribute selectors, so the 'custom' surface is applied
 * as an inline custom property instead - that outranks every rule in the stylesheet.
 */
const useSidebarSurface = () => {
    const { sidebarSurface, sidebarCustomColorLight, sidebarCustomColorDark } = useAppSelector(selectOptions);
    const [os, setOs] = useState<string | undefined>(undefined);

    useEffect(() => {
        void getPlatformOs().then(setOs);
    }, []);

    // only Linux resolves the panel surface color to the platform theme
    const surface = sidebarSurface === 'auto' ? (os === 'linux' ? 'system-theme' : 'builtin-theme') : sidebarSurface;

    const style: CSSProperties | undefined =
        surface === 'custom'
            ? ({
                  '--background-color-sidebar': `light-dark(${sidebarCustomColorLight}, ${sidebarCustomColorDark})`,
              } as CSSProperties)
            : undefined;

    return { os, surface, style };
};

export default useSidebarSurface;
