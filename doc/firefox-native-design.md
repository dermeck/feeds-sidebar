# Making the Sidebar Look Native in Firefox

How to make the sidebar match Firefox's own UI. Token values verified against
mozilla-central `master` (source of truth: `toolkit/themes/shared/design-system/`,
built from `design-tokens.json` into `tokens-shared.css`, `tokens-brand.css`,
`tokens-platform.css`). Last verified 2026-09-19 (Firefox 157 era).

## The theming model: chrome vs in-content

Two theming layers apply to Firefox chrome:

1. **System / native theme** — colors and fonts come from the OS via CSS system
   colors (`Canvas`, `ButtonFace`, `-moz-MenuHover`, …).
2. **Installed themes (LWT)** — chrome surfaces (toolbar, popup, sidebar, …)
   get their values from the **platform (chrome)** token set: accent =
   `AccentColor`, text = `currentColor`.

A WebExtension sidebar is **chrome** (part of Firefox's UI framing, not `about:`
page content), so it uses the **platform** tokens; in-content pages (`about:`)
use the **brand** tokens. Mozilla's official design system for extensions is
**Acorn**.

> `browser_style` is deprecated in MV3; legacy sheets are at
> `chrome://browser/content/extension.css`.

## Reference design: the updated sidebar

Firefox has TWO sidebar designs. This project mirrors the **updated sidebar**
(`sidebar.revamp`), NOT the legacy one.

- **Legacy sidebar** — the classic flat `places` tree: plain folder rows, no
  rounded cards, no pill counts. Retired (off by default in Nightly 148+,
  removed in 153+). Do not use this as a reference.
- **Updated sidebar** — shipping since Firefox 136, default since 2026.
  Launcher rail + per-tool panels.

How to tell them apart when in doubt: legacy = flat tree rows + old header band;
updated = launcher rail, accordion cards, pill counts.

In the updated sidebar, the date-grouped history view uses
`<moz-card type="accordion">`: rounded, bordered cards ("pills") whose header
(label + disclosure + count) expands into a big card holding the rows. Only the
first two cards start expanded; nested groups use borderless `nested-card`
mini-cards. Card styling comes from the Acorn `--card-*` tokens.

Local mirror: `src/base-components/Card/` implements the accordion-card
treatment via `Card type="accordion"`; keep it synced with the `moz-card`
accordion behavior above.

## Design tokens

### Platform (chrome) tokens — what a sidebar should use

| Token | Value |
|---|---|
| `--background-color-canvas` | `Canvas` |
| `--text-color` | `currentColor` |
| `--color-accent-primary` | `AccentColor` |
| `--button-background-color` | `color-mix(in srgb, currentColor 13%, transparent)` |
| `--button-background-color-hover` | `color-mix(in srgb, currentColor 17%, transparent)` |
| `--button-background-color-active` | `color-mix(in srgb, currentColor 30%, transparent)` |
| `--button-border-color` | transparent |
| `--link-color` | `LinkText` |
| `--border-color-interactive` | `color-mix(in srgb, currentColor 15%, var(--color-gray-60))` |
| `--border-color-deemphasized` | `color-mix(in srgb, currentColor 24%, transparent)` |

Key takeaway: **Acorn chrome buttons are not `ButtonFace` — they're a subtle
`currentColor` tint** (13% rest, 17% hover, 30% active) with a transparent
border. This is closer to the native look than a flat `ButtonFace` fill.

### Shared size/spacing tokens

| Token | Value |
|---|---|
| `--size-item-small` / `--size-item-medium` / `--size-item-large` | `16px` / `24px` / `32px` |
| `--space-small` / `--space-medium` / `--space-large` | `8px` / `12px` / `16px` |
| `--border-radius-small` / `--border-radius-medium` / `--border-radius-large` | `4px` / `8px` / `12px` (this repo overrides `--border-radius-medium` to `12px` and adds `--border-radius-xlarge` = `24px` for the Nova button look) |
| `--button-min-height` | `--size-item-large` = `32px` |
| `--button-min-height-small` | `--size-item-medium` = `24px` |
| `--button-size-icon` / `--button-size-icon-small` | `32px` / `24px` |
| `--button-padding` | `var(--space-xsmall) var(--space-large)` = `4px 16px` |
| `--focus-outline-width` / `--focus-outline-offset` | `2px` / `2px` |

## Nova (Project Nova) — the current look

Firefox's desktop UI refresh ("Project Nova") flattens boxed surfaces into
rounded "pill" rows. It ships *through* Acorn's token pipeline — same token
names, new values (larger radii, borderless surfaces) — so it is not a separate
design system: Acorn is the system, Nova is the current set of values. As of
Firefox 157 (Sept 2026) Nova is the default look, so a Nova-flavoured sidebar is
just matching current Firefox chrome.

For the date-grouped history view (`moz-card` accordions) Nova means:

- Cards become **borderless and transparent** (the accordion header stays, the
  enclosing box disappears) so rows run edge-to-edge.
- Every list/tree row is a fully rounded **pill**: `var(--border-radius-circle)`
  (9999px) on a `--size-item-large` (`32px`) row, with a `--space-xsmall` (4px)
  gap between rows.
- Buttons/inputs use a taller radius scale (icon buttons become round);
  `--border-radius-medium` is effectively bumped to `12px`.
- Selected/current rows swap the flat accent fill for a **ring**: a 1px accent
  outline (`outline: 1px solid var(--color-accent-primary); outline-offset: -1px`)
  with a subtle tinted background.

Local mirror (the rows/cards below already implement this):
- `src/sidebar/MainView/date-sorted-list/date-sorted-list.css` — Nova card look:
  borderless `.card`, `.card__content` with no inline padding, `.feed-item` pills
  at `var(--border-radius-circle)` with a `--space-xsmall` row gap.
- Pill radius + selection ring on the shared rows: `.feed-item` /
  `.folder__title-container` at a 99% radius
  (`src/sidebar/MainView/FeedList/item/feed-list-item.css`,
  `src/sidebar/MainView/folder-tree/Folder/folder.css`).
- `src/sidebar/MainView/plain-list/main-view-plain-list.css` adds the 4px row gap
  for the pill stacks.

## References

Design system:
- Acorn Design System: https://acorn.firefox.com
  - Browser Anatomy (chrome vs in-content):
    https://acorn.firefox.com/latest/desktop/patterns/browser-anatomy/overview-3wKOLEK9
  - Design tokens overview:
    https://acorn.firefox.com/latest/desktop/design-tokens/how-design-tokens-work/overview-YYp6MVjt
  - Storybook (live component + token reference):
    https://acorn.firefox.com/latest/get-started/resources/developer-MjYKs2SN
- MDN Sidebars (`sidebar_action`):
  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Sidebars
- MDN `theme` manifest key (chrome color keys):
  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme
- MDN CSS system colors: https://developer.mozilla.org/en-US/docs/Web/CSS/system-color

Firefox sidebar source (all in mozilla-central — https://hg.mozilla.org/mozilla-central,
browse at https://searchfox.org/firefox-main — mirrored read-only on GitHub at
https://github.com/mozilla-firefox/firefox):
- Source Docs → Sidebar (real implementation, history/other panels):
  https://firefox-source-docs.mozilla.org/browser/components/sidebar/docs/index.html
- Sidebar views: https://searchfox.org/firefox-main/source/browser/components/sidebar
  (`sidebar-history.mjs`, `sidebar-syncedtabs.mjs`, …)
- `moz-card` accordion — component:
  https://searchfox.org/firefox-main/source/toolkit/content/widgets/moz-card
  CSS: https://searchfox.org/firefox-main/source/toolkit/content/widgets/moz-card/moz-card.css

Firefox design-token docs:
- Source Docs → Design Tokens (JSON → CSS pipeline, naming, theming, HCM):
  https://firefox-source-docs.mozilla.org/toolkit/themes/shared/design-system/docs/README.design-tokens.stories.html
- Source Docs → Storybook (the `moz-*` component library docs):
  https://firefox-source-docs.mozilla.org/browser/components/storybook/docs/README.storybook.stories.html
- Hosted Storybook (live `moz-*` components + token table, no build needed):
  https://firefoxux.github.io/firefox-desktop-components

Nova-specific:
- Mozilla blog → "Designing Firefox for the future" (official Nova announcement,
  May 2026): https://blog.mozilla.org/en/firefox/new-firefox-design/
- MDN → Firefox 157 release notes (Nova ships with 157, Sept 2026):
  https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/157
- Mechanism (engineering source of truth, Bugzilla):
  - Bug 2017650 — swapping to themed design tokens based on a pref:
    https://bugzilla.mozilla.org/show_bug.cgi?id=2017650
  - Bug 2056186 — enabling `browser.nova.enabled` in all channels (157):
    https://bugzilla.mozilla.org/show_bug.cgi?id=2056186

Token source of truth (`toolkit/themes/shared/design-system/` in mozilla-central):
- Editable source: `design-tokens.json` (single JSON; built into the CSS below
  with style-dictionary via `tokens-config.js` / `figma-tokens-config.js`)
- Built CSS: `tokens-shared.css`, `tokens-brand.css`, `tokens-platform.css`
- Browse: https://searchfox.org/firefox-main/source/toolkit/themes/shared/design-system
- Raw CSS (via the gecko-dev mirror):
  https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/themes/shared/design-system/tokens-shared.css
  (also `tokens-platform.css`, `tokens-brand.css`)