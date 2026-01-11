# Mi Familia Taco Catering (2015)

Static marketing site for **Mi Familia Taco Catering** (multi-page brochure site). Originally built as classic `.htm` pages with an Artisteer-generated theme; updated to `.html` pages with light JavaScript for navigation behavior and a photo gallery slider.

This repo is a good “small-but-real” example of shipping a complete website: consistent navigation across pages, a conversion flow (quote request), SEO meta tags, and a light sprinkle of unobtrusive JavaScript.

## Highlights (design + development)

- **Cohesive theme + layout system**: two-column layout with reusable “sheet” components, headers, and menu blocks (see `art-*` classes throughout the markup).
- **Conversion funnel**: `catering.html` → `quote.html` form → `thankyou.html` / `error.html` redirect flow.
- **Photo gallery UX**: slider-style gallery with thumbnail navigation (vanilla JS in `js/gallery-slider.js`).
- **Progressive enhancement**: the site works as plain HTML/CSS; JS mainly enhances menus (active state/hover behavior) and the gallery.
- **Modernized baseline (2026 refresh)**: HTML5 doctype + viewport meta, improved responsive behavior, and no jQuery requirement.
- **SEO basics**: per-page `<title>`, and descriptive `meta` tags (description/keywords).

## Tech stack

- HTML: **HTML5**
- CSS: Artisteer v3 theme output (design by Artisteer; development updates by Frank Jamison)
- JavaScript:
  - `js/script.js`: small vanilla JS enhancements (menu separators, vmenu “active” state)
  - `js/gallery-slider.js`: lightweight gallery slider behavior (no external libraries)

## Site map

- `index.html` — Home / welcome copy
- `stand.html` — Taco stand menu and hours
- `catering.html` — Catering overview + link to quote request
- `quote.html` — Catering packages + “Request a Quote” form
- `gallery.html` — Photo gallery (vanilla slider)
- `about-us.html` — About copy
- `contact-us.html` — Phone numbers + email link
- `thankyou.html` — Confirmation page after quote submission
- `error.html` — Error page if submission fails

## Run locally

You can open `index.html` directly in a browser, but using a local static server avoids file:// restrictions and is closer to production behavior.

### Option A: Python

```bash
python -m http.server 8000
```

Then visit `http://127.0.0.1:8000/index.html`.

### Option B: Node

```bash
npx http-server -p 8000
```

Then visit `http://127.0.0.1:8000/index.html`.

## Quote form behavior

The quote form on `quote.html` posts to a hosted form handler:

- Endpoint: `http://www.powweb.com/scripts/formemail.bml`
- Required fields are configured via hidden inputs (`required`, `order`)
- Recipient is set via hidden input (`my_email`)
- Redirects to live URLs on success/failure (`thankyou_url`, `error_url`)

When running locally, submitting the form will still attempt to post to that external endpoint.

## Deployment

This project can be deployed to any static host (traditional hosting, S3, Netlify, etc.).

- Upload the entire folder (relative paths assume `css/`, `js/`, `images/`, `photos/` remain intact).
- Ensure the host serves `.html` files as HTML.

## Developer notes / maintenance

- **Navigation is duplicated** in the markup (top menu `ul.art-menu` + sidebar menu `ul.art-vmenu`). When changing nav items, update both on each page.
- **Gallery images** are hard-coded in `gallery.html` as a thumbnail list pointing to `photos/01.jpg`–`photos/20.jpg`.
- Gallery thumbnails are simple links; the slider behavior progressively enhances them.
- `js/script.js` is intentionally minimal and runs on `DOMContentLoaded`.

## 2026 refresh notes

- Migrated pages from legacy `.htm` to `.html` and updated internal links.
- Markup updated to HTML5 + viewport meta.
- Legacy IE6/IE7 shims removed (no old conditional IE markup required).
- jQuery removed (theme behavior is now vanilla JS).
- Removed the broken legacy gallery (Jssor) and replaced it with a lightweight vanilla JS slider.
  - Autoplay is configured via `data-autoplay-interval` (currently `3000` ms in `gallery.html`).
  - Fade transitions are enabled (1000ms).
  - Autoplay is resilient to user interaction (no “stuck after click/focus” behavior).
  - Autoplay respects `prefers-reduced-motion` by default; this repo explicitly enables autoplay on the gallery via `data-autoplay="on"`.
- Gallery image display updated to avoid stretching (preserves aspect ratio on the main image and thumbnails).
- Added responsive layout improvements (the theme is fixed-width by default).
- Mobile navigation improved:
  - Top navigation stacks cleanly at small widths.
  - Mobile top nav is styled to match the sidebar `art-vmenublock` look.
  - Sidebar menu is hidden at mobile widths to avoid duplicate navigation.
- Dev tooling: VS Code “Open in Browser” task targets `index.html`.
