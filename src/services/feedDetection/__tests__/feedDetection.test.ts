import { detectFeedsForSite, parseUrl } from '../feedDetection';

describe('parseUrl', () => {
    it('parses a full url', () => {
        expect(parseUrl('https://github.com/foo/bar')?.href).toBe('https://github.com/foo/bar');
    });

    it('defaults to https when the scheme is missing', () => {
        expect(parseUrl('github.com/foo/bar')?.href).toBe('https://github.com/foo/bar');
    });

    it('trims surrounding whitespace', () => {
        expect(parseUrl('  github.com/foo/bar  ')?.href).toBe('https://github.com/foo/bar');
    });

    it('keeps an explicit http scheme', () => {
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
    it('resolves a scheme-less input the same as a full url', () => {
        const withoutScheme = detectFeedsForSite(parseUrl('github.com/foo/bar')!);
        const withScheme = detectFeedsForSite(parseUrl('https://github.com/foo/bar')!);

        expect(withoutScheme.map((x) => x.href)).toEqual(withScheme.map((x) => x.href));
    });

    it('returns nothing for an unknown host', () => {
        expect(detectFeedsForSite(new URL('https://example.com/foo'))).toEqual([]);
    });

    it('returns nothing for a plain wordpress blog', () => {
        expect(detectFeedsForSite(new URL('https://wordpress.com/foo'))).toEqual([]);
    });
});