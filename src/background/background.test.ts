jest.mock('../store/sagas/worker/createWorker', () => ({ createWorker: jest.fn() }));

const listeners = {
    onUpdated: { addListener: jest.fn() },
    onActivated: { addListener: jest.fn() },
};

const alarms = { create: jest.fn(), onAlarm: { addListener: jest.fn() } };

const tabs = {
    get: jest.fn(() => Promise.resolve({ url: 'https://example.com/blog' })),
    sendMessage: jest.fn(() => Promise.resolve()),
    onUpdated: listeners.onUpdated,
    onActivated: listeners.onActivated,
};

const storageGet = jest.fn<Promise<Record<string, unknown>>, [string]>();

const withLoadedOptions = (options: Record<string, unknown>) => {
    const stored: Record<string, Record<string, unknown>> = {
        feedsKey: { feeds: [], folders: [] },
        optionsKey: options,
    };

    storageGet.mockImplementation(async (key) => (key in stored ? { [key]: stored[key] } : {}));
};

const holdingFirstRead = () => {
    storageGet.mockImplementationOnce(() => new Promise<Record<string, unknown>>(() => undefined));
    storageGet.mockImplementation(async () => ({}));
};

const fireTabEvent = (tabId: number) => listeners.onUpdated.addListener.mock.calls[0][0](tabId, { status: 'complete' });

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const importBackground = async () => {
    await import('./background');
    await flush();
};

beforeEach(() => {
    jest.resetModules();
    listeners.onUpdated.addListener.mockClear();
    listeners.onActivated.addListener.mockClear();
    alarms.create.mockClear();
    tabs.sendMessage.mockClear();
    storageGet.mockReset();

    (global as unknown as { browser: unknown }).browser = {
        action: { setBadgeText: jest.fn(), onClicked: { addListener: jest.fn() } },
        alarms,
        runtime: {
            getPlatformInfo: jest.fn(),
            onSuspend: { addListener: jest.fn() },
            onMessage: { addListener: jest.fn() },
            sendMessage: jest.fn(() => Promise.resolve()),
        },
        storage: { local: { get: storageGet } },
        tabs,
    };
});

describe('tab event while the state is still loading', () => {
    it('does not look for feeds', async () => {
        holdingFirstRead();

        const importing = import('./background');
        await Promise.resolve();
        fireTabEvent(1);
        await importing;
        await flush();

        expect(tabs.sendMessage).not.toHaveBeenCalled();
    }, 20000);
});

describe('tab event after the state is loaded', () => {
    it('does not look for feeds when detection is switched off', async () => {
        withLoadedOptions({ feedDetectionEnabled: false });

        await importBackground();
        fireTabEvent(1);
        await flush();

        expect(tabs.sendMessage).not.toHaveBeenCalled();
    });

    it('looks for feeds when detection is switched on', async () => {
        withLoadedOptions({ feedDetectionEnabled: true });

        await importBackground();
        fireTabEvent(1);
        await flush();

        expect(tabs.sendMessage).toHaveBeenCalledTimes(1);
    });
});
