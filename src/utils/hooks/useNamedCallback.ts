import { DependencyList, useCallback, useDebugValue } from 'react';

// TODO check if the usages if this hook should be removed (performance impact?)
// eslint-disable-next-line @typescript-eslint/ban-types
function useNamedCallback<T extends Function>(name: string, callback: T, deps: DependencyList): T {
    useDebugValue(name);
    return useCallback(callback, deps);
}

export default useNamedCallback;
