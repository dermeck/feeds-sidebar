import { formatDuration } from './timeUtils';

describe('#formatDuration', () => {
    it('formats durations under a minute', () => {
        expect(formatDuration(0)).toBe('0:00');
        expect(formatDuration(31)).toBe('0:31');
    });

    it('formats durations under an hour as m:ss', () => {
        expect(formatDuration(60)).toBe('1:00');
        expect(formatDuration(754)).toBe('12:34');
    });

    it('formats durations of an hour or more as h:mm:ss', () => {
        expect(formatDuration(3600)).toBe('1:00:00');
        expect(formatDuration(3725)).toBe('1:02:05');
    });

    it('floors fractional seconds', () => {
        expect(formatDuration(59.9)).toBe('0:59');
    });

    it('returns an empty string for invalid input', () => {
        expect(formatDuration(-1)).toBe('');
        expect(formatDuration(Number.NaN)).toBe('');
        expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('');
    });
});
