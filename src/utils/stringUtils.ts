export const hashCode = (str: string): number => {
    let hash = 0;
    const strlen = str.length;

    if (strlen === 0) {
        return hash;
    }

    let char;
    for (let i = 0; i < strlen; i++) {
        char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }

    return hash;
};
