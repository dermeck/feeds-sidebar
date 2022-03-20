import { useEffect, useState } from 'react';

const usePrefersColorSchemeDark = () => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    const [prefersColorSchemeDark, setPrefersColorSchemeDark] = useState<boolean>(mediaQueryList.matches);

    const handleChange = () => setPrefersColorSchemeDark(mediaQueryList.matches);

    useEffect(() => {
        mediaQueryList.addEventListener('change', handleChange);

        return () => {
            mediaQueryList.removeEventListener('change', handleChange);
        };
    }, []);

    return prefersColorSchemeDark;
};

export default usePrefersColorSchemeDark;
