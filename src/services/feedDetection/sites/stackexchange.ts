import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'atom' });

const siteName = (url: URL) => url.hostname.replace(/^www\./, '');

const detect = (url: URL): DetectedFeed[] => {
    const [first, second, third] = pathSegments(url);

    if (first === 'questions' && second === 'tagged' && third !== undefined) {
        // multiple tags are separated by '+' (e.g. /questions/tagged/typescript+react)
        return [feed(`${siteName(url)} Tag (${third})`, `${url.origin}/feeds/tag/${third}`)];
    }

    if (first === 'questions' && second !== undefined && /^\d+$/.test(second)) {
        return [feed(`${siteName(url)} Question (${second})`, `${url.origin}/feeds/question/${second}`)];
    }

    return [feed(`${siteName(url)} New Questions`, `${url.origin}/feeds`)];
};

export const stackExchangeDetector: SiteDetector = {
    hostnames: [
        'stackoverflow.com',
        'serverfault.com',
        'superuser.com',
        'askubuntu.com',
        'stackapps.com',
        'stackexchange.com',
        'mathoverflow.net',
    ],
    detect,
};
