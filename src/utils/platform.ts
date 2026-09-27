let platformOs: Promise<string> | undefined;

// the -moz-platform media query is chrome-only, so the platform has to come from the runtime API
export const getPlatformOs = (): Promise<string> => {
    platformOs ??= (async () => {
        try {
            return (await browser.runtime.getPlatformInfo()).os;
        } catch {
            return 'unknown';
        }
    })();

    return platformOs;
};
