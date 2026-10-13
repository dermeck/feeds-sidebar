import { normalizeUrl, resolveUrl } from './url';

describe('resolveUrl', () => {
    it('resolves protocol-relative urls', () => {
        expect(resolveUrl('//example.com/foo')?.href).toBe('https://example.com/foo');
    });

    it('adds https to scheme-less urls', () => {
        expect(resolveUrl('example.com/foo')?.href).toBe('https://example.com/foo');
    });

    it('keeps existing protocol', () => {
        expect(resolveUrl('http://example.com/foo')?.href).toBe('http://example.com/foo');
    });

    it('trims whitespace', () => {
        expect(resolveUrl('  //example.com/foo  ')?.href).toBe('https://example.com/foo');
    });
});

describe('normalizeUrl', () => {
    it('normalizes protocol-relative urls', () => {
        expect(normalizeUrl('//example.com/foo')).toBe('https://example.com/foo');
    });
});
