import { DetectedFeed, SiteDetector } from '../feedDetection';
import { pathSegments } from './pathUtils';

const feed = (title: string, href: string): DetectedFeed => ({ title, href, type: 'atom' });

const siteName = (url: URL) => url.hostname.replace(/^www\./, '');

const detect = (url: URL): DetectedFeed[] => {
    const [first, second, third] = pathSegments(url);
    const name = siteName(url);

    // https://stackoverflow.com/questions/tagged/typescript+react
    if (first === 'questions' && second === 'tagged' && third !== undefined) {
        return [feed(`${name} Tag (${third})`, `${url.origin}/feeds/tag/${third}`)];
    }

    return [feed(`${name} New Questions`, `${url.origin}/feeds`)];
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