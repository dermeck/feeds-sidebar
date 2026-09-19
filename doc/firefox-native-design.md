# Making the Sidebar Look Native in Firefox

How to make the sidebar match Firefox's own UI. Token values verified against `mozilla/gecko-dev` `master` (source of truth: `toolkit/themes/shared/design-system/` in mozilla-central, compiled to `tokens-shared.css`, `tokens-brand.css`, `tokens-platform.css`).

## Two theming layers

1. **System / native theme** — colors and fonts come from the OS via CSS system colors (`Canvas`, `ButtonFace`, `-moz-MenuHover`, …).
2. **Installed themes (LWT)** — Firefox chrome surfaces (toolbar, popup, sidebar, …) get values from the **platform (chrome)** token set: accent = `AccentColor`, text = `currentColor`.

A WebExtension sidebar is **chrome** (part of Firefox's UI framing, not `about:` page content). Chrome surfaces use the **platform** tokens, in-content pages (`about:`) use the **brand** tokens. Mozilla's official design system for extensions is **Acorn**.

## Key references

- Acorn Design System: https://acorn.firefox.com
  - Browser Anatomy (chrome vs in-content): https://acorn.firefox.com/latest/desktop/patterns/browser-anatomy/overview-3wKOLEK9
  - Design tokens overview: https://acorn.firefox.com/latest/desktop/design-tokens/how-design-tokens-work/overview-YYp6MVjt
- MDN Sidebars (`sidebar_action`): https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Sidebars
- MDN `theme` manifest key (chrome color keys): https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme
- MDN CSS system colors: https://developer.mozilla.org/en-US/docs/Web/CSS/system-color

Note: `browser_style` is deprecated in MV3; legacy sheets are at `chrome://browser/content/extension.css`.

## Quick reference

Brand, like storybook references.
- Acorn → Storybook (live component + token reference): https://acorn.firefox.com/latest/get-started/resources/developer-MjYKs2SN
- Firefox Source Docs → Design Tokens (JSON → CSS pipeline, naming, theming, HCM): https://firefox-source-docs.mozilla.org/toolkit/themes/shared/design-system/docs/README.design-tokens.stories.html
- Firefox Source Docs → Storybook (the `moz-*` component library docs): https://firefox-source-docs.mozilla.org/browser/components/storybook/docs/README.storybook.stories.html
- **Hosted Storybook** (live `moz-*` components + token table, no build needed): https://firefoxux.github.io/firefox-desktop-components
- Firefox Source Docs → Sidebar (real sidebar implementation, bookmarks/history panels): https://firefox-source-docs.mozilla.org/browser/components/sidebar/docs/index.html

Token source (source of truth, in mozilla-central): `toolkit/themes/shared/design-system/`
- JSON sources (edit these): `src/tokens/**/*.tokens.json`
- Built CSS: `tokens-shared.css`, `tokens-brand.css`, `tokens-platform.css`
- Browse: https://searchfox.org/firefox-main/source/toolkit/themes/shared/design-system
- Raw CSS: https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/themes/shared/design-system/tokens-shared.css (also `tokens-platform.css`, `tokens-brand.css`)

## Chrome (platform) tokens — what a sidebar should use

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

Key takeaway: **Acorn chrome buttons are not `ButtonFace` — they're a subtle `currentColor` tint** (13% rest, 17% hover, 30% active) with a transparent border. This is closer to the native look than a flat `ButtonFace` fill.

## Shared size/spacing tokens

| Token | Value |
|---|---|
| `--size-item-small` / `--size-item-medium` / `--size-item-large` | `16px` / `24px` / `32px` |
| `--space-small` / `--space-medium` / `--space-large` | `8px` / `12px` / `16px` |
| `--border-radius-small` / `--border-radius-medium` / `--border-radius-large` | `4px` / `8px` / `16px` (Acorn base; this repo overrides `--border-radius-medium` to `12px` for the Nova look) |
| `--button-min-height` | `--size-item-large` = `32px` |
| `--button-min-height-small` | `--size-item-medium` = `24px` |
| `--button-size-icon` / `--button-size-icon-small` | `32px` / `24px` |
| `--button-padding` | `var(--space-xsmall) var(--space-large)` = `4px 16px` |
| `--focus-outline-width` / `--focus-outline-offset` | `2px` / `2px` |

## Which sidebar design is the reference

Firefox has TWO sidebar designs. This project mirrors the **updated sidebar**
(`sidebar.revamp`), NOT the legacy one.

- **Legacy sidebar** — the classic flat `places` tree: plain folder rows, no
  rounded cards, no pill counts. Being retired (off by default in Nightly 148+,
  removed entirely in 153+). Do not use this as a reference.
- **Updated sidebar** — shipping since Firefox 136, default in 2026. Launcher
  rail + per-tool panels.

Sources (all in mozilla-central — https://hg.mozilla.org/mozilla-central,
browse at https://searchfox.org/firefox-main — mirrored read-only on GitHub at
https://github.com/mozilla-firefox/firefox):
- Sidebar views:
  https://searchfox.org/firefox-main/source/browser/components/sidebar
  (`sidebar-history.mjs`, `sidebar-bookmarks.mjs`, …)
- Date-grouped history view uses `<moz-card type="accordion">`:
  - component:
    https://searchfox.org/firefox-main/source/toolkit/content/widgets/moz-card
  - CSS:
    https://searchfox.org/firefox-main/source/toolkit/content/widgets/moz-card/moz-card.css
  Rounded, bordered cards ("pills") whose header (label + disclosure + count)
  expands into a big card holding the rows. Only the first two cards start
  expanded (`DAYS_EXPANDED_INITIALLY = 2` in
  https://searchfox.org/firefox-main/source/browser/components/sidebar/sidebar-history.mjs);
  nested groups use borderless `nested-card` mini-cards.
- Card styling comes from the Acorn `--card-*` tokens (token sources:
  https://searchfox.org/firefox-main/source/toolkit/themes/shared/design-system)

How to tell them apart when in doubt: legacy = flat tree rows + old header band;
updated = launcher rail, accordion cards, pill counts.

Local mirror: `src/base-components/Card/` implements the accordion-card
treatment via `Card type="accordion"`; keep it synced with the `moz-card`
accordion behavior above.

## Nova (Project Nova) — the upcoming redesign

Firefox's desktop UI refresh ("Project Nova") is the look in **Nightly and
Developer Edition** when `browser.nova.enabled` is `true` (rolling out to all
users in Firefox 157, ~Sept 2026). It flattens boxed surfaces into more
rounded "pill" rows.

**Nova is not a replacement for Acorn.** Acorn remains the design system
(tokens, component library, naming); Nova is a visual refresh shipped
*through* the same token pipeline. Nova is registered as a design-token
override — `override-identifiers.js` maps the name `nova` to the
`browser.nova.enabled` pref — and the changed values live in
`*.nova.tokens.json` files that keep the same token names. Acorn's own docs
describe it as "our upcoming Project Nova redesign". So Nova = Acorn with
different token *values* (radii and colors), not a different system. Making
an Acorn-aligned UI "Nova" is just overriding token values, exactly what the
date-sorted list overrides do below.

For the date-grouped history view (`sidebar-history.mjs` + `moz-card`
accordions) Nova means:

- Cards become **borderless and transparent** (the accordion header stays,
  but the enclosing box disappears):
  - `--card-background-color: transparent`
  - `border: none` (`browser/components/sidebar/sidebar.css`, under
    `@media -moz-pref("browser.nova.enabled")`)
  - `--card-padding: 0` → `moz-card` `#content` loses its inline inset, so
    the rows extend all the way to the card edge
  - the header `#heading-wrapper` keeps a small `padding-inline: 8px`
- Every list/tree row becomes a fully rounded **pill** — the row hosts use
  `border-radius: var(--border-radius-circle)` (9999px) on a
  `--size-item-large` (`32px`) row (`sidebar-tab-list.css`, and
  `sidebar-bookmark-list.css` for bookmark rows and folder labels):
  - the tab rows (`sidebar-tab-row` / `fxview-tab-row-main`) keep their own
    `padding-inline: 8px 4px` and are separated by a `--space-xsmall` (`4px`)
    gap in the list
  - folder/bookmark rows get the same circle radius in Nova (they were
    `--border-radius-small`/`medium` before, outside of the nova pref)
- Buttons and inputs get the Nova radius scale (`button.nova.tokens.json`,
  `border.nova.tokens.json`): buttons use `--border-radius-xlarge` (`24px`, so
  icon buttons become circles) and `--border-radius-medium` is bumped to
  `12px`. In this repo those are the Nova overrides in the local Acorn tokens:
  `src/base-styles/acorn/tokens.css` (`--border-radius-medium` = `12px`,
  `--button-border-radius` = `--border-radius-xlarge`). Menus are left at the
  Acorn defaults for now.
- Selected/current rows swap the flat accent fill for a **ring**:
  `outline: 1px solid var(--tab-border-color-selected); outline-offset: -1px`,
  a `1px` transparent border, and a subtle tinted background instead of a
  solid fill (`sidebar-tab-row.css`, `sidebar-opentabs.css`)

Reference files (same mozilla-central source as above):
- `browser/components/sidebar/sidebar.css` (Nova `moz-card` overrides)
- `browser/components/sidebar/sidebar-tab-list.css`, `sidebar-tab-row.css`
  (row pill radius + Nova ring variant)
- `browser/components/sidebar/sidebar-bookmark-list.css` (folder/bookmark rows)
- Token-override mechanism:
  https://firefox-source-docs.mozilla.org/toolkit/themes/shared/design-system/docs/README.design-tokens.stories.html

Local mirror:
- `src/sidebar/MainView/date-sorted-list/date-sorted-list.css` implements the
  Nova card look (borderless `.card`, `.card__content` with no inline padding,
  `.feed-item` pills at `var(--border-radius-circle)` with a `--space-xsmall`
  row gap).
- The pill radius and the Nova selection ring live on the shared rows:
  `.feed-item` / `.folder__title-container` base 99% radius
  (`src/sidebar/MainView/FeedList/item/feed-list-item.css`,
  `src/sidebar/MainView/folder-tree/Folder/folder.css`), with the rounded
  accent outline (`outline: 1px solid var(--color-accent-primary)`) replacing
  the flat accent fill for selected/unread rows.
- `src/sidebar/MainView/plain-list/main-view-plain-list.css` adds the 4px row
  gap for the pill stacks.

