export const resolveUrl = (url: string): URL | undefined => {
    try {
        const trimmed = url.trim();
        if (trimmed.startsWith('//')) {
            return new URL(`https:${trimmed}`);
        }
        if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
            return new URL(`https://${trimmed}`);
        }
        return new URL(trimmed);
    } catch {
        return undefined;
    }
};

export const normalizeUrl = (url: string): string => {
    const resolved = resolveUrl(url);
    if (resolved === undefined) {
        return url;
    }
    return resolved.href;
};
