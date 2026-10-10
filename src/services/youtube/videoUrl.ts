const VIDEO_ID_PATTERN = /^[\w-]{11}$/;

const resolveUrl = (url: string): URL | undefined => {
    try {
        if (url.startsWith('//')) {
            return new URL(`https:${url}`);
        }
        if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(url)) {
            return new URL(`https://${url}`);
        }
        return new URL(url);
    } catch {
        return undefined;
    }
};

const matchVideoId = (value: string): string | undefined => {
    return VIDEO_ID_PATTERN.test(value) ? value : undefined;
};

export const youtubeVideoIdFromUrl = (url: string): string | undefined => {
    const parsed = resolveUrl(url);

    if (parsed === undefined) {
        return undefined;
    }

    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
        return matchVideoId(parsed.pathname.slice(1));
    }

    if (host !== 'youtube.com' && !host.endsWith('.youtube.com')) {
        return undefined;
    }

    const watchId = parsed.searchParams.get('v');
    if (watchId !== null) {
        return matchVideoId(watchId);
    }

    const [section, id] = parsed.pathname.split('/').filter(Boolean);
    if ((section === 'shorts' || section === 'live' || section === 'embed') && id !== undefined) {
        return matchVideoId(id);
    }

    return undefined;
};

export const youtubeVideoIdFromItemId = (id: string): string | undefined => {
    const match = /^yt:video:([\w-]{11})$/.exec(id);

    return match === null ? undefined : match[1];
};