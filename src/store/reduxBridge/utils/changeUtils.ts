const DIFF_STATUS_UPDATED = 'updated';
// The `change` value for updated or inserted fields resulting from shallow diff

// The `change` value for removed fields resulting from shallow diff
const DIFF_STATUS_REMOVED = 'removed';

// TODO mr determine the store changes
/**
 * Returns a new Object containing only the fields in `new` that differ from `old`
 *
 * @param {Object} old
 * @param {Object} new
 * @return {Array} An array of changes. The changes have a `key`, `value`, and `change`.
 *   The change is either `updated`, which is if the value has changed or been added,
 *   or `removed`.
 */

//   Object.fromEntries(Object.entries(o2).filter(([k, v]) => o1[k] !== v))

export function shallowDiff(oldObj, newObj) {
    const difference: unknown[] = [];

    Object.keys(newObj).forEach((key) => {
        if (oldObj[key] !== newObj[key]) {
            difference.push({
                key,
                value: newObj[key],
                change: DIFF_STATUS_UPDATED,
            });
        }
    });

    Object.keys(oldObj).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(newObj, key)) {
            difference.push({
                key,
                change: DIFF_STATUS_REMOVED,
            });
        }
    });

    return difference;
}

// TODO mr apply partial changes to store
export function applyChanges(obj, difference) {
    const newObj = Object.assign({}, obj); // structuredClone

    difference.forEach(({ change, key, value }) => {
        switch (change) {
            case DIFF_STATUS_UPDATED:
                newObj[key] = value;
                break;

            case DIFF_STATUS_REMOVED:
                Reflect.deleteProperty(newObj, key);
                break;

            default:
            // do nothing
        }
    });

    return newObj;
}
