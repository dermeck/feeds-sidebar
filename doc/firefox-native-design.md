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
| `--border-radius-small` / `--border-radius-medium` / `--border-radius-large` | `4px` / `8px` / `12px` |
| `--button-min-height` | `--size-item-large` = `32px` |
| `--button-min-height-small` | `--size-item-medium` = `24px` |
| `--button-size-icon` / `--button-size-icon-small` | `32px` / `24px` |
| `--button-padding` | `var(--space-xsmall) var(--space-large)` = `4px 16px` |
| `--focus-outline-width` / `--focus-outline-offset` | `2px` / `2px` |

## How this project maps

| Project (base-styles.css / button.css) | Acorn token | Verdict |
|---|---|---|
| `--control-height: 32px` | `--size-item-large` | match |
| Radius `4px` (button, inputs) | `--border-radius-small` | match |
| 22px icons in 32px toolbar buttons | `--icon-size-large` (24px) | close |
| `font: caption`, header 48px | platform `unset` (system font) | match (chrome surface) |
| `.toolbar-button` transparent bg, `.button` uses `currentColor` tint | `--button-background-color` (13% / 17% hover / 30% active) | match |
| `focus-visible`: 2px accent outline, offset 2px | `--focus-outline` | match |
| no `prefers-contrast` / `forced-colors` | HCM layers | **missing** |

The HCM links in `tokens-shared.css` (accents → `ButtonText`/`SelectedItem`, borders → `CanvasText`/`ButtonText`, disabled → `GrayText`) are the missing piece for full parity.