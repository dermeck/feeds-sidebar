import { shallowDiff, applyChanges } from './changeUtils';

describe('#shallowDiff', () => {
    it('detects if existing properties changed', () => {
        const oldObj = { a: 1, b: 1 };
        const newObj = { a: 2, b: 2 };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual([
            {
                key: 'a',
                value: 2,
                change: 'updated',
            },
            {
                key: 'b',
                value: 2,
                change: 'updated',
            },
        ]);
    });

    it('detects if new properties were added', () => {
        const oldObj = { a: 1 };
        const newObj = { a: 1, b: 3 };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual([
            {
                key: 'b',
                value: 3,
                change: 'updated',
            },
        ]);
    });

    it('detects if new properties were removed', () => {
        const oldObj = { a: 1, b: 1 };
        const newObj = { a: 1 };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual([
            {
                key: 'b',
                change: 'removed',
            },
        ]);
    });

    it('detects multiple changes', () => {
        const oldObj = { a: 1, b: 1 };
        const newObj = { a: 2, c: 3 };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual([
            {
                key: 'a',
                value: 2,
                change: 'updated',
            },
            {
                key: 'c',
                value: 3,
                change: 'updated',
            },

            {
                key: 'b',
                change: 'removed',
            },
        ]);
    });

    test.each([false, null, undefined, 0, '', NaN])('detects change to falsy value "%s" as update', (value) => {
        const oldObj = { a: 1 };
        const newObj = { a: value };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual([
            {
                key: 'a',
                value: value,
                change: 'updated',
            },
        ]);
    });
});

describe('#applyChanges', () => {
    it('updates existing properties', () => {
        const oldObj = { a: 1 };
        const changes = [
            {
                key: 'a',
                value: 2,
                change: 'updated',
            },
        ];

        expect(applyChanges(oldObj, changes)).toStrictEqual({ a: 2 });
    });

    it('updates new properties', () => {
        const oldObj = { a: 1 };
        const changes = [
            {
                key: 'b',
                value: 2,
                change: 'updated',
            },
        ];

        expect(applyChanges(oldObj, changes)).toStrictEqual({ a: 1, b: 2 });
    });

    it('deletes removed properties', () => {
        const oldObj = { a: 1, b: 2 };
        const changes = [
            {
                key: 'a',
                value: 1,
                change: 'removed',
            },
        ];

        expect(applyChanges(oldObj, changes)).toStrictEqual({ b: 2 });
    });

    it('applys multiple changes', () => {
        const oldObj = { a: 1, b: 1 };
        const changes = [
            {
                key: 'a',
                value: 2,
                change: 'updated',
            },
            {
                key: 'c',
                value: 3,
                change: 'updated',
            },

            {
                key: 'b',
                change: 'removed',
            },
        ];

        expect(applyChanges(oldObj, changes)).toStrictEqual({ a: 2, c: 3 });
    });
});
