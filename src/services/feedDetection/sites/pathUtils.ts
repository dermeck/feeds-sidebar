export const pathSegments = (url: URL): string[] => url.pathname.split('/').filter(Boolean);
