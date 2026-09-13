import { SiteDetector } from '../feedDetection';
import { githubDetector } from './github';
import { gitlabDetector } from './gitlab';
import { hackerNewsDetector } from './hackernews';
import { redditDetector } from './reddit';
import { stackExchangeDetector } from './stackexchange';
import { youtubeDetector } from './youtube';

export const siteDetectors: ReadonlyArray<SiteDetector> = [
    githubDetector,
    gitlabDetector,
    hackerNewsDetector,
    redditDetector,
    stackExchangeDetector,
    youtubeDetector,
];
