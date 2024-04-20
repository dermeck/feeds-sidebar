export type Changes = {
    updatedProperties: {
        key: string;
        value: unknown;
    }[];
    deletedProperties: string[];
};

export const shallowDiff = (oldObject: object, newObject: object): Changes => {
    const difference: Changes = {
        updatedProperties: [],
        deletedProperties: [],
    };

    Object.entries(newObject).forEach(([key, value]) => {
        if (value !== oldObject[key]) {
            difference.updatedProperties.push({ key, value: newObject[key] });
        }
    });

    Object.keys(oldObject).forEach(([key]) => {
        if (!Object.prototype.hasOwnProperty.call(newObject, key)) {
            difference.deletedProperties.push(key);
        }
    });

    return difference;
};

export const applyChanges = (oldObject: object, changes: Changes) => {
    const newObject = Object.assign({}, oldObject);

    changes.updatedProperties.forEach(({ key, value }) => {
        newObject[key] = value;
    });

    changes.deletedProperties.forEach((key) => {
        delete newObject[key];
    });

    return newObject;
};
