import { SiteDetector } from '../feedDetection';
import { githubDetector } from './github';
import { gitlabDetector } from './gitlab';
import { hackerNewsDetector } from './hackernews';
import { kickstarterDetector } from './kickstarter';
import { mediumDetector } from './medium';
import { redditDetector } from './reddit';
import { stackExchangeDetector } from './stackexchange';
import { substackDetector } from './substack';
import { youtubeDetector } from './youtube';

export const siteDetectors: ReadonlyArray<SiteDetector> = [
    githubDetector,
    gitlabDetector,
    hackerNewsDetector,
    kickstarterDetector,
    mediumDetector,
    redditDetector,
    stackExchangeDetector,
    substackDetector,
    youtubeDetector,
];