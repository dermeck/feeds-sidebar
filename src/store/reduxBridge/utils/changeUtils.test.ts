import { Changes, applyChanges, shallowDiff } from './changeUtils';

describe('#shallowDiff', () => {
    it('detects if existing properties changed', () => {
        const oldObj = { aKey: 1, bKey: 1 };
        const newObj = { aKey: 2, bKey: 2 };

        const expectation: Changes = {
            updatedProperties: [
                {
                    key: 'aKey',
                    value: 2,
                },
                {
                    key: 'bKey',
                    value: 2,
                },
            ],
            deletedProperties: [],
        };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual(expectation);
    });

    it('detects if new properties were added', () => {
        const oldObj = { aKey: 1 };
        const newObj = { aKey: 1, bKey: 3 };

        const expectation: Changes = {
            updatedProperties: [
                {
                    key: 'bKey',
                    value: 3,
                },
            ],
            deletedProperties: [],
        };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual(expectation);
    });

    it('detects if new properties were removed', () => {
        const oldObj = { aKey: 1, bKey: 1 };
        const newObj = { aKey: 1 };

        const expectation: Changes = {
            updatedProperties: [],
            deletedProperties: ['bKey'],
        };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual(expectation);
    });

    it('detects multiple changes', () => {
        const oldObj = { aKey: 1, bKey: 1 };
        const newObj = { aKey: 2, cKey: 3 };

        const expectation: Changes = {
            updatedProperties: [
                {
                    key: 'aKey',
                    value: 2,
                },
                {
                    key: 'cKey',
                    value: 3,
                },
            ],
            deletedProperties: ['bKey'],
        };

        expect(shallowDiff(oldObj, newObj)).toStrictEqual(expectation);
    });

    test.each([false, null, undefined, 0, '', NaN])('detects change to falsy value "%s" as update', (value) => {
        const oldObj = { aKey: 1 };
        const newObj = { aKey: value };

        const expectation: Changes = {
            updatedProperties: [
                {
                    key: 'aKey',
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
        const oldObj = { aKey: 1 };
        const changes: Changes = {
            updatedProperties: [
                {
                    key: 'aKey',
                    value: 2,
                },
            ],
            deletedProperties: [],
        };

        expect(applyChanges(oldObj, changes)).toStrictEqual({ aKey: 2 });
    });

    it('updates new properties', () => {
        const oldObj = { aKey: 1 };
        const changes: Changes = {
            updatedProperties: [
                {
                    key: 'bKey',
                    value: 2,
                },
            ],
            deletedProperties: [],
        };

        expect(applyChanges(oldObj, changes)).toStrictEqual({ aKey: 1, bKey: 2 });
    });

    it('deletes removed properties', () => {
        const oldObj = { aKey: 1, bKey: 2 };
        const changes: Changes = {
            updatedProperties: [],
            deletedProperties: ['aKey'],
        };

        expect(applyChanges(oldObj, changes)).toStrictEqual({ bKey: 2 });
    });

    it('applys multiple changes', () => {
        const oldObj = { aKey: 1, bKey: 1 };
        const changes: Changes = {
            updatedProperties: [
                {
                    key: 'aKey',
                    value: 2,
                },
                {
                    key: 'cKey',
                    value: 3,
                },
            ],
            deletedProperties: ['bKey'],
        };

        expect(applyChanges(oldObj, changes)).toStrictEqual({ aKey: 2, cKey: 3 });
    });
});
