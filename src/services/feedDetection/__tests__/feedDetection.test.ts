import { detectFeedsForSite, parseUrl } from '../feedDetection';

describe('parseUrl', () => {
    it('parses a full url', () => {
        expect(parseUrl('https://github.com/foo/bar')?.href).toBe('https://github.com/foo/bar');
    });

    it('defaults to https when the protocol is missing', () => {
        expect(parseUrl('github.com/foo/bar')?.href).toBe('https://github.com/foo/bar');
    });

    it('trims surrounding whitespace', () => {
        expect(parseUrl('  github.com/foo/bar  ')?.href).toBe('https://github.com/foo/bar');
        expect(parseUrl('  https://github.com/foo/bar  ')?.href).toBe('https://github.com/foo/bar');
        expect(parseUrl('\nhttps://github.com/foo/bar\n')?.href).toBe('https://github.com/foo/bar');
    });

    it('keeps an explicit http protocol', () => {
        expect(parseUrl('http://github.com/foo/bar')?.href).toBe('http://github.com/foo/bar');
    });

    it('returns undefined for input that is not a url', () => {
        expect(parseUrl('not a url')).toBeUndefined();
    });

    it('returns undefined for empty input', () => {
        expect(parseUrl('')).toBeUndefined();
    });
});

describe('detectFeedsForSite', () => {
    it('resolves a protocol-less input the same as a full url', () => {
        const withoutProtocol = detectFeedsForSite(parseUrl('github.com/foo/bar')!);
        const withProtocol = detectFeedsForSite(parseUrl('https://github.com/foo/bar')!);

        expect(withoutProtocol.map((x) => x.href)).toEqual(withProtocol.map((x) => x.href));
    });

    it('returns nothing for an unknown host', () => {
        expect(detectFeedsForSite(new URL('https://example.com/foo'))).toEqual([]);
    });

    it('returns nothing for a plain wordpress blog', () => {
        expect(detectFeedsForSite(new URL('https://wordpress.com/foo'))).toEqual([]);
    });
});