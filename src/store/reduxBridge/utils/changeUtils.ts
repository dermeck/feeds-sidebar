export type Changes = {
    updatedProperties: {
        key: string;
        value: unknown;
    }[];
    deletedProperties: string[];
};

export const shallowDiff = (oldObject: { [key: string]: unknown }, newObject: { [key: string]: unknown }): Changes => {
    const difference: Changes = {
        updatedProperties: [],
        deletedProperties: [],
    };

    Object.entries(newObject).forEach(([key, value]) => {
        if (value !== oldObject[key]) {
            difference.updatedProperties.push({ key, value: newObject[key] });
        }
    });

    Object.keys(oldObject).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(newObject, key)) {
            difference.deletedProperties.push(key);
        }
    });

    return difference;
};

export const applyChanges = (oldObject: { [key: string]: unknown }, changes: Changes) => {
    const newObject = Object.assign({}, oldObject);

    changes.updatedProperties.forEach(({ key, value }) => {
        newObject[key] = value;
    });

    changes.deletedProperties.forEach((key) => {
        delete newObject[key];
    });

    return newObject;
};
