import { useEffect, useState } from 'react';

import { SidebarSurface } from '../store/slices/options';
import { getPlatformOs } from '../utils/platform';

/** Resolves the sidebar background option to the platform values that sidebar-styles.css keys on. */
const useSidebarSurface = (sidebarSurface: SidebarSurface) => {
    const [os, setOs] = useState<string | undefined>(undefined);

    useEffect(() => {
        void getPlatformOs().then(setOs);
    }, []);

    // only Linux resolves the panel surface color to the platform theme
    const surface = sidebarSurface === 'auto' ? (os === 'linux' ? 'system-theme' : 'builtin-theme') : sidebarSurface;

    return { os, surface };
};

export default useSidebarSurface;
