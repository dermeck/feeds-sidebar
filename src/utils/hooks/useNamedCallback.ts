import { DependencyList, useCallback, useDebugValue } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
function useNamedCallback<T extends Function>(name: string, callback: T, deps: DependencyList): T {
    useDebugValue(name);
    return useCallback(callback, deps);
}

export default useNamedCallback;
