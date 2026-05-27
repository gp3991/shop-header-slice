# Shop header — slicing from design

A responsive header coded from the `layout.png` design. Recruitment task (front-end / PrestaShop).

> The visible UI copy stays in Polish on purpose — it is the actual shop content from `layout.png`.

## Quick preview

The compiled CSS is committed in the repo — just open **`index.html`** in a browser.
No installation is required to see the result.

## Stack

- **HTML5** — semantic markup (`<header>`, `<nav>`, `<form role="search">`), inline SVG.
- **SCSS** → CSS (Dart Sass), mobile-first, **BEM** naming, CSS custom properties.
- **Vanilla JS** — mobile drawer (hamburger) with accessibility support (aria, ESC, focus trap) and a sticky-header shadow on scroll.
- No CSS frameworks.

## Working with styles

```bash
npm install        # installs sass (devDependency)
npm run build      # compiles src/scss -> css/style.css (readable)
npm run build:min  # minified version
npm run watch      # live rebuild while working
```

## Structure

```
index.html            # header markup + demo section
src/scss/
  style.scss          # entry point (@use partials)
  _variables.scss     # tokens: colors, breakpoints, spacing, font
  _base.scss          # reset, container, a11y helpers, focus
  _topbar.scss        # utility bar (top)
  _header.scss        # sticky wrapper + main bar + RWD orchestration + hamburger
  _search.scss        # search field
  _actions.scss       # favourites / account / cart + separators
  _drawer.scss        # mobile drawer + close (X) button
  _products.scss      # demo product grid (out of task scope — page filler)
css/style.css         # COMPILED (committed)
js/nav.js             # mobile drawer + sticky-header shadow
asset/                # original SVG icons (source; inlined into the HTML)
```

## Responsive behavior (mobile-first)

| Breakpoint            | Layout |
|-----------------------|--------|
| **< 768 px** (mobile) | `[☰] [LOGO] [icons]`, full-width search on its own row. Utility bar hidden — its links live in the drawer behind the hamburger. Icons without labels. |
| **768–1199 px** (tablet) | One row: `LOGO` (left) \| **wide** search (fills the middle, small gap next to the logo) \| icons (right). Icon labels **hidden** (icons only). Vertical separators and utility bar visible. |
| **≥ 1200 px** (desktop) | One row: `LOGO` \| search (**perfectly centered**, max 720px) \| actions. Icon **labels** appear (favourites / account / cart). |

Mechanism:
- **mobile** (<768) — `flex` with `flex-wrap` and `order`; the search wraps onto its own row below,
- **tablet** (768–1199) — **CSS Grid** `auto minmax(0, 1fr) auto`: side columns are sized to their
  content (logo / icons) and the search fills the rest → a wide field with no large gap next to the logo,
- **desktop** (≥1200) — **CSS Grid** `minmax(20rem, 1fr) minmax(0, 720px) minmax(20rem, 1fr)`: equal
  side columns place the search at the geometric center of the navbar; when space runs short, the middle
  column shrinks symmetrically.

No markup duplication — the same HTML drives all three layouts.

## Technical decisions

- **Inline SVG** instead of `<img>` — icons inherit color via `currentColor` (consistent hover, easy
  theming under PrestaShop), scale cleanly, and stay accessible (`aria-hidden`, label on the parent).
  The originals remain in `asset/` as the source.
- **Outfit font** loaded from Google Fonts (`400` as the base/Regular + `500/600/700` for
  `LOGO`, `Lorem ipsum` and labels). Offline alternative: self-host the `woff2` files via `@font-face`.
- **Sticky header** — `position: sticky` on the outer `<header>`; a soft shadow is toggled from JS
  (`.is-stuck`) only once the page scrolls under the bar. Stacking stays below the mobile drawer.
- **Mobile search** — the "Szukaj" label collapses to the bare magnifier on phones so the placeholder
  stays readable; the label returns from tablet up (matching the design). The icon button keeps an
  `aria-label`, so it has an accessible name in both states.
- **Accessibility**: skip link, visible `:focus-visible`, `role="search"` with a hidden label,
  `aria-expanded`/`aria-hidden` for the drawer, explicit close (X) button, focus trap and ESC handling.

## PrestaShop integration (note)

The markup is clean and ready to move into a theme's Smarty template — the sections (topbar / header /
search / actions) map onto typical hooks and can be wired up without changing the CSS structure.
