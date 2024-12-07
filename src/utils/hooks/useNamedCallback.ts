import { DependencyList, useCallback, useDebugValue } from 'react';

// TODO check if the usages if this hook should be removed (performance impact?)
// eslint-disable-next-line @typescript-eslint/ban-types
function useNamedCallback<T extends Function>(name: string, callback: T, deps: DependencyList): T {
    useDebugValue(name);
    const array = [...deps];
    // eslint-disable-next-line react-compiler/react-compiler
    return useCallback(callback, [array, callback]);
}

export default useNamedCallback;
