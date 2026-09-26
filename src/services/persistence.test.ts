import { initialState as initialOptions } from '../store/slices/options';
import { initialState as initialSession } from '../store/slices/session';
import { loadState, saveState } from './persistence';

const storage: Record<string, unknown> = {};

const storageLocal = {
    get: jest.fn(async (key: string) => (key in storage ? { [key]: storage[key] } : {})),
    set: jest.fn(async (data: Record<string, unknown>) => Object.assign(storage, data)),
};

beforeEach(() => {
    Object.keys(storage).forEach((key) => delete storage[key]);
    storageLocal.get.mockClear();
    storageLocal.set.mockClear();
    (global as unknown as { browser: unknown }).browser = { storage: { local: storageLocal } };
});

const validFeeds = { folders: [], feeds: [], selectedNode: undefined };

describe('saveState', () => {
    it('writes the feeds, the options and a timestamp', async () => {
        const state = { feeds: validFeeds, options: initialOptions, session: initialSession };

        await saveState(state as Parameters<typeof saveState>[0]);

        expect(storageLocal.set).toHaveBeenCalledTimes(1);
        expect(storage).toStrictEqual({
            feedsKey: validFeeds,
            optionsKey: initialOptions,
            timestampKey: expect.any(Number),
        });
    });
});

describe('loadState', () => {
    beforeEach(() => {
        storage.optionsKey = initialOptions;
        storage.timestampKey = 1700000000000;
    });

    it('returns the persisted state', async () => {
        storage.feedsKey = validFeeds;

        await expect(loadState()).resolves.toStrictEqual({
            feeds: validFeeds,
            options: initialOptions,
            session: initialSession,
            timestamp: 1700000000000,
        });
    });

    it.each([
        ['missing', undefined],
        ['null', null],
        ['a string', 'not a state'],
        ['a number', 42],
        ['an empty object', {}],
        ['a state without feeds', { folders: [] }],
        ['a state without folders', { feeds: [] }],
    ])('returns undefined when the feeds entry is %s', async (_, value) => {
        if (value !== undefined) {
            storage.feedsKey = value;
        }

        await expect(loadState()).resolves.toBeUndefined();
    });

    it.each([
        ['missing', undefined],
        ['null', null],
        ['a string', 'not a state'],
    ])('returns undefined when the options entry is %s', async (_, value) => {
        storage.feedsKey = validFeeds;
        delete storage.optionsKey;
        if (value !== undefined) {
            storage.optionsKey = value;
        }

        await expect(loadState()).resolves.toBeUndefined();
    });
});
