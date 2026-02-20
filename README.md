# Mi Familia Taco Catering

Static multi-page marketing site for Mi Familia Taco Catering. The site is plain HTML/CSS with a small amount of vanilla JavaScript for theme/navigation behavior and a lightweight photo gallery slider.

Live preview:

- https://mifamiliatacos.fcjamison.com/

## Quick start (dev)

1. Start a static server from the repo root.
2. Open the site in a browser.
3. Edit the `.html` pages and refresh.

There is no build step and no dependency install required.

## Project goals / non-goals

- Goal: simple, host-anywhere static site (no build step, no framework).
- Goal: progressive enhancement (works without JS; JS improves UX).
- Non-goal: modern SPA routing, bundling, or a component system.

## Tech stack

- HTML: HTML5 pages
- CSS: single stylesheet at `css/style.css` (Artisteer theme output + updates)
- JavaScript:
  - `js/script.js`: theme enhancements (menu separators + vertical-menu active-link highlighting)
  - `js/gallery-slider.js`: gallery slider (thumb navigation, keyboard support, optional autoplay)

## Repo layout

- `*.html`: content pages
- `css/style.css`: global styles
- `js/`: site JS
- `images/`: theme images/assets
- `photos/`: gallery images used by `gallery.html`
- `.vscode/tasks.json`: convenience tasks

## Pages

- `index.html` — Home
- `stand.html` — Taco stand
- `catering.html` — Catering overview
- `quote.html` — Quote request form
- `gallery.html` — Gallery slider
- `about-us.html` — About
- `contact-us.html` — Contact
- `thankyou.html` / `error.html` — Form redirects

## Run locally

Because this is a static site, any static server works. Opening files directly via `file://` also works, but a server is closer to production behavior.

### Option A: Python

```bash
python -m http.server 8000
```

Then browse to `http://127.0.0.1:8000/index.html`.

### Option B: Node

```bash
npx http-server -p 8000
```

Then browse to `http://127.0.0.1:8000/index.html`.

### VS Code task: Open in Browser (localhost)

This repo includes a VS Code task named **Open in Browser** configured in `.vscode/tasks.json`.

- Current behavior: launches Chrome to `http://mifamiliatacocatering.localhost/`
- What that implies: you need something serving this folder on port **80** for the host name `mifamiliatacocatering.localhost`.

Notes:

- `*.localhost` domains typically resolve to `127.0.0.1` automatically in modern browsers, but you still need a web server bound to that host/port.
- If you’re using `python -m http.server 8000`, the task URL won’t match. To make the task work with the Python/Node examples above, change the task URL to `http://127.0.0.1:8000/index.html`.

Practical options depending on what you want:

- Keep the task as-is (port 80): run a server on port `80` (may require admin/elevated shell on Windows):
  - `python -m http.server 80`
  - or `npx http-server -p 80`
- Keep the `mifamiliatacocatering.localhost` host but use a non-80 port: access `http://mifamiliatacocatering.localhost:8000/index.html` in the browser (and update the task URL accordingly).
- Simplest: update the task URL to match whatever local server/port you use (example above).

## Quote form behavior (and local/testing caveats)

The form in `quote.html` posts to a hosted handler:

- Action: `http://www.powweb.com/scripts/formemail.bml`
- Redirects:
  - success: `thankyou_url` → `http://mifamiliatacocatering.com/thankyou.html`
  - failure: `error_url` → `http://mifamiliatacocatering.com/error.html`

Implications for developers:

- When running locally, submitting the form will still POST to that external endpoint.
- If you’re viewing the site over **HTTPS** (including the live preview), an **HTTP** form action/redirect may be blocked or behave unexpectedly by the browser due to mixed-content rules.

## Making edits safely

- Navigation is duplicated on every page (top nav: `ul.art-menu`, sidebar nav: `ul.art-vmenu`). If you change links or labels, update both menus across pages.
- Gallery images are hard-coded in `gallery.html` as `photos/01.jpg` … `photos/20.jpg`. If you add/remove photos, update both the main image and the thumbnail list.

### Gallery slider configuration

The slider is initialized by `js/gallery-slider.js` on any element with `data-gallery`.

Attributes used by `gallery.html` today:

- `data-autoplay-interval="3000"`: time between slides (ms)
- `data-autoplay="on"`: forces autoplay on, even if the user has `prefers-reduced-motion: reduce`

Other supported attributes (if you ever need them):

- `data-autoplay="off"`: disable autoplay
- `data-autoplay-pause="hover"`: pause while the mouse is hovering the gallery

Keyboard:

- When the gallery container is focused, left/right arrows navigate.

### Theme/navigation JS

`js/script.js` intentionally stays small and runs on `DOMContentLoaded`:

- Inserts separator elements into the Artisteer menus (`ul.art-menu`, `ul.art-vmenu`) if they’re missing
- Adds an `.active` class to the vertical menu link that matches the current page filename

Because the top and side nav are duplicated across pages, changes are mostly “mechanical” edits: update the markup consistently across all `*.html` files.

## Troubleshooting

- Images/CSS missing when running locally: make sure you started the server from the repo root (the folder that contains `index.html`, `css/`, `images/`, `js/`).
- VS Code task opens a blank page: the task points at `http://mifamiliatacocatering.localhost/` (port 80). If you’re serving on port 8000, update the task URL or start a server on port 80.
- Quote form doesn’t work on HTTPS: the form action is HTTP and may be blocked as mixed content. Test the form on an HTTP origin or change to a secure form handler.

## Deployment

Deploy by uploading the folder to any static host.

- Keep relative paths intact (`css/`, `js/`, `images/`, `photos/`).
- Ensure the host serves `.html` as HTML.

## Attribution

- Theme/layout originally generated with Artisteer (see site footer for attribution).
