const getPlatformInfo = jest.fn();

beforeEach(() => {
    getPlatformInfo.mockReset();
    (global as unknown as { browser: unknown }).browser = { runtime: { getPlatformInfo } };
    jest.resetModules();
});

// the module memoizes its promise, so every test needs its own copy of it
const freshGetPlatformOs = async () => (await import('./platform')).getPlatformOs;

describe('getPlatformOs', () => {
    it('resolves the os the runtime reports', async () => {
        getPlatformInfo.mockResolvedValue({ os: 'linux', arch: 'x86-64' });
        const getPlatformOs = await freshGetPlatformOs();

        await expect(getPlatformOs()).resolves.toBe('linux');
    });

    it('resolves unknown when the runtime call fails', async () => {
        getPlatformInfo.mockRejectedValue(new Error('no browser'));
        const getPlatformOs = await freshGetPlatformOs();

        await expect(getPlatformOs()).resolves.toBe('unknown');
    });

    it('queries the runtime once and reuses the promise', async () => {
        getPlatformInfo.mockResolvedValue({ os: 'win', arch: 'x86-64' });
        const getPlatformOs = await freshGetPlatformOs();

        expect(await getPlatformOs()).toBe('win');
        expect(await getPlatformOs()).toBe('win');

        expect(getPlatformInfo).toHaveBeenCalledTimes(1);
    });
});
