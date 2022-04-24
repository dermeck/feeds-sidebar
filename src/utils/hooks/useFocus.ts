import { useRef } from 'react';

function useFocus<T extends HTMLElement>() {
    const htmlElRef = useRef<T>(null);
    const setFocus = () => {
        htmlElRef.current && htmlElRef.current.focus();
    };

    const result = [htmlElRef, setFocus] as const;
    return result;
}

export default useFocus;
