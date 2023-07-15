export const moveOrInsertElementBefore = <T>(array: ReadonlyArray<T>, target: T, moved: T): ReadonlyArray<T> => {
    // remove moved element from current position
    const result = [...array].filter((x) => x !== moved);
    // insert before target element
    const targetIndex = result.indexOf(target);
    result.splice(targetIndex, 0, moved);

    return result;
};

export const moveOrInsertElementAfter = <T>(array: ReadonlyArray<T>, target: T, moved: T): ReadonlyArray<T> => {
    // remove moved element from current position
    const result = [...array].filter((x) => x !== moved);
    // insert after target element
    const targetIndex = result.indexOf(target);
    result.splice(targetIndex + 1, 0, moved);

    return result;
};
