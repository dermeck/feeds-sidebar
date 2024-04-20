import { Changes, applyChanges, shallowDiff } from './changeUtils';

describe('#shallowDiff', () => {
    it('detects if existing properties changed', () => {
        const oldObj = { a: 1, b: 1 };
        const newObj = { a: 2, b: 2 };

        const expectation: Changes = {
            updatedProperties: [
                {
                    key: 'a',
                    value: 2,
                },
                {
                    key: 'b',
                    value: 2,
                },
            ],
            deletedProperties: [],
        };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual(expectation);
    });

    it('detects if new properties were added', () => {
        const oldObj = { a: 1 };
        const newObj = { a: 1, b: 3 };

        const expectation: Changes = {
            updatedProperties: [
                {
                    key: 'b',
                    value: 3,
                },
            ],
            deletedProperties: [],
        };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual(expectation);
    });

    it('detects if new properties were removed', () => {
        const oldObj = { a: 1, b: 1 };
        const newObj = { a: 1 };

        const expectation: Changes = {
            updatedProperties: [],
            deletedProperties: ['b'],
        };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual(expectation);
    });

    it('detects multiple changes', () => {
        const oldObj = { a: 1, b: 1 };
        const newObj = { a: 2, c: 3 };

        const expectation: Changes = {
            updatedProperties: [
                {
                    key: 'a',
                    value: 2,
                },
                {
                    key: 'c',
                    value: 3,
                },
            ],
            deletedProperties: ['b'],
        };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual(expectation);
    });

    test.each([false, null, undefined, 0, '', NaN])('detects change to falsy value "%s" as update', (value) => {
        const oldObj = { a: 1 };
        const newObj = { a: value };

        const expectation: Changes = {
            updatedProperties: [
                {
                    key: 'a',
                    value: value,
                },
            ],
            deletedProperties: [],
        };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual(expectation);
    });
});

describe('#applyChanges', () => {
    it('updates existing properties', () => {
        const oldObj = { a: 1 };
        const changes: Changes = {
            updatedProperties: [
                {
                    key: 'a',
                    value: 2,
                },
            ],
            deletedProperties: [],
        };

        expect(applyChanges(oldObj, changes)).toStrictEqual({ a: 2 });
    });

    it('updates new properties', () => {
        const oldObj = { a: 1 };
        const changes: Changes = {
            updatedProperties: [
                {
                    key: 'b',
                    value: 2,
                },
            ],
            deletedProperties: [],
        };

        expect(applyChanges(oldObj, changes)).toStrictEqual({ a: 1, b: 2 });
    });

    it('deletes removed properties', () => {
        const oldObj = { a: 1, b: 2 };
        const changes: Changes = {
            updatedProperties: [],
            deletedProperties: ['a'],
        };

        expect(applyChanges(oldObj, changes)).toStrictEqual({ b: 2 });
    });

    it('applys multiple changes', () => {
        const oldObj = { a: 1, b: 1 };
        const changes: Changes = {
            updatedProperties: [
                {
                    key: 'a',
                    value: 2,
                },
                {
                    key: 'c',
                    value: 3,
                },
            ],
            deletedProperties: ['b'],
        };

        expect(applyChanges(oldObj, changes)).toStrictEqual({ a: 2, c: 3 });
    });
});
