# Feed detection

## Overview

- Detection is triggered by the background script when a tab becomes active or finishes loading. The background script sends a `StartFeedDetection` message to the page.
- The page-action / content-script listens for `StartFeedDetection`, calls `detectFeeds()` and sends a `FeedsDetected` message back to the background.
- The background maps `FeedsDetected` to a Redux action and stores detected feeds.

## Detection flow

Detection aggregates results from two sources:

- `detectFeedsInLinks()` — inspects `link[type]` elements on the page and matches known RSS/Atom MIME types.
- `detectFeedsForSite()` — runs the site detectors in `sites/` against the current page URL.

```mermaid
flowchart LR
  BT[Browser Tabs] --> BG[Background]
  BG -->|send StartFeedDetection| CS[PageAction ContentScript]
  CS --> DF[detectFeeds]
  DF --> LNK[detectFeedsInLinks]
  DF --> DFS[detectFeedsForSite]
  DFS --> SITE[Site Detectors]
  LNK --> DEDUP[deduplicate by normalized url]
  SITE --> DEDUP
  DEDUP --> DET[Detected Feeds]
  DET -->|send FeedsDetected| BG
  BG -->|dispatch feedsDetected| STORE[Redux Store]
```

## Site detectors

Each detector in `sites/` is a pure function from a `URL` to feed candidates.

```ts
export type SiteDetector = {
    hostnames: ReadonlyArray<string>;
    detect: (url: URL) => DetectedFeed[];
};
```

A detector runs when one of its hostnames matches the page hostname.

Add a new site by adding a file to `sites/` and listing it in `sites/siteDetectors.ts`.

| Site | Rule |
|---|---|
| GitHub | `/{owner}/{repo}` → `releases.atom`, `tags.atom`, `commits.atom`. `/{user}` → `/{user}.atom`. Section pages narrow to the matching feed. |
| GitLab | Splits the project path at the `-` separator. `{project}.atom`, `{project}/-/issues.atom`, `{project}/-/tags?format=atom`. |
| Hacker News | Frontpage only, at `/rss`. Per-user and per-item feeds would need the third party `hnrss.org`, which this extension deliberately does not depend on. |
| Kickstarter | `/projects/{creator}/{slug}` → `/posts.atom` (project updates). |
| Medium | `@{handle}`, `{handle}`, `{publication}`, `/tag/{tag}`, `/{pub}/tagged/{tag}` → the matching `/feed/…` path. `{handle}.medium.com` → `medium.com/feed/{handle}`; the subdomain serves no feed of its own. |
| Reddit | Appends `.rss`, preserving the query. Covers subreddits, sorts, single posts, users, multireddits, search and domain listings. |
| Stack Exchange | `/questions/tagged/{tag}` → `/feeds/tag/{tag}`, otherwise `/feeds`. |
| Substack | `{origin}/feed` on any `*.substack.com` host. The path is discarded — `/`, `/about` and `/archive` all resolve to the same feed. |
| YouTube | `list` query parameter → playlist feed. `/channel/{id}` → channel feed. |

## Which feeds are detected

- **Link-based detection** looks for `link[type]` elements whose `type` matches one of the
  following MIME types:

  - `application/rss+xml`
  - `application/atom+xml`
  - `application/rdf+xml`
  - `application/rss`
  - `application/atom`
  - `application/rdf`
  - `text/rss+xml`
  - `text/atom+xml`
  - `text/rdf+xml`
  - `text/rss`
  - `text/atom`
  - `text/rdf`