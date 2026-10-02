export type PlatformOs = browser.runtime.PlatformOs;

let platformOs: Promise<PlatformOs | 'unknown'> | undefined;

// the -moz-platform media query is chrome-only, so the platform has to come from the runtime API
export const getPlatformOs = (): Promise<PlatformOs | 'unknown'> => {
    platformOs ??= (async () => {
        try {
            return (await browser.runtime.getPlatformInfo()).os;
        } catch {
            return 'unknown';
        }
    })();

    return platformOs;
};
