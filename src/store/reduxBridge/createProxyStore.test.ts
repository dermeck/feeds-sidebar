import { createProxyStore } from './createProxyStore';
import { MessageType } from './messaging';

const sendMessage = jest.fn(() => Promise.resolve());

let processMessage: (message: unknown) => void;

beforeEach(() => {
    sendMessage.mockClear();
    processMessage = () => undefined;

    (global as unknown as { browser: unknown }).browser = {
        runtime: {
            sendMessage,
            onMessage: { addListener: jest.fn((cb: (message: unknown) => void) => (processMessage = cb)) },
        },
    };
});

describe('messages the other proxies send', () => {
    it('are ignored', () => {
        createProxyStore();

        expect(() =>
            processMessage({ type: MessageType.DispatchAction, action: { type: 'options/changeMaxItems' } }),
        ).not.toThrow();
        expect(() => processMessage({ type: MessageType.GetFullStateRequest })).not.toThrow();
    });
});
