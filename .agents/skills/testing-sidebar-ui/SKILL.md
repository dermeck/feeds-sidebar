---
name: testing-sidebar-ui
description: How to run and test the feeds-sidebar UI end-to-end without Firefox, using the stand-alone webpack harness with seeded Redux state and locally served feed fixtures.
---

# Testing the feeds-sidebar UI (stand-alone harness)

Firefox / `web-ext run` may not be installed on the box (only Chrome). The stand-alone harness is the
practical way to exercise the real sidebar UI end-to-end.

## Run it

```bash
yarn start:stand-alone   # webpack-dev-server on http://localhost:8080/index.html
```

- Serves `src/stand-alone/` statically **with `Access-Control-Allow-Origin: *`** (see `webpack.stand-alone.js`),
  so any XML file you drop into `src/stand-alone/<dir>/` can be subscribed as a feed at
  `http://localhost:8080/<dir>/<file>.xml` and will actually fetch + parse in the feed worker.
- Hot rebuild on file save; a browser reload picks up changes (dev-server logs to check: `webpack compiled successfully`).
- `webpack --mode development` means `NODE_ENV=development`, so `src/store/slices/feeds.ts` seeds
  sample feeds with **empty `items`** and no `lastFetched`.

## Seeding realistic state (feeds restored from storage, nothing fetched yet)

There is no `browser.storage` in stand-alone. To reproduce "extension just started, feeds restored,
`session.feedStatus` still empty" (a state that is otherwise unreachable in the harness), temporarily add
to `src/stand-alone/index.tsx` before `root.render(...)`:

```tsx
import { extensionStateLoaded } from '../store/actions';
import { initialState as optionsInitialState } from '../store/slices/options';
import { rootFolderId } from '../model/feeds';

store.dispatch(extensionStateLoaded({ options: optionsInitialState, feeds: { selectedNode: undefined,
  folders: [{ id: rootFolderId, title: 'root', feedIds: [...urls], subfolderIds: [] }],
  feeds: [{ id: url, title: 'X', lastFetched: <iso>, items: [{ id, title, url, published: <iso> }] }] } }));
```

Revert this file (`git checkout src/stand-alone/index.tsx`) and delete the fixture folder when done.

## Useful UI paths

- Diagnosis view: header "More Options" (…) button → "Diagnosis" (`MoreMenu.tsx`), Close button returns to feed list.
- "Fetch all Feeds" = the circular-arrows button, first item in the header.
- Feed fetch classification: a URL that 404s (or returns non-feed content) ends up with status `error`;
  a feed whose newest item is older than `options.diagnosisInactiveDays` (default 60) is "inactive".
- Handy trick to prove a Retry button really refetches: subscribe to a URL that 404s, then create the
  file on disk mid-test and click Retry — the row should move out of "Feeds with errors".

## Known / possible issues

- `session.feedStatus` keeps entries for URLs even after the feed is deleted, so a removed feed can leave
  a "ghost" row (raw URL, `Last fetch: —`) in the Diagnosis view until the session state is reset;
  Remove on such a row is a no-op. Watch for this when testing removal flows.
- `yarn test` has a preexisting date-dependent failure in
  `src/sidebar/MainView/date-sorted-list/dateSortedFeedItems.test.ts` — unrelated.
- corepack may be broken on the box; use the globally installed `yarn` instead.

## Devin Secrets Needed

None.
