export const moveElementBefore = <T>(array: ReadonlyArray<T>, targetNodeId: T, movedNodeId: T): ReadonlyArray<T> => {
    // remove moved element from current position
    const result = [...array].filter((x) => x !== movedNodeId);
    // insert before target element
    const targetIndex = result.indexOf(targetNodeId);
    result.splice(targetIndex, 0, movedNodeId);

    return result;
};
