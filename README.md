# Mi Familia Taco Catering (2015)

Static marketing website for **Mi Familia Taco Catering**. The site is built as a set of classic `.htm` pages styled with an Artisteer-generated theme and enhanced with a small amount of JavaScript (menu behavior and an image slider on the gallery page).

## What’s in this repo

### Pages

- `index.htm` — Home / welcome copy.
- `stand.htm` — Taco stand menu and hours.
- `catering.htm` — Catering overview and link to quote request.
- `quote.htm` — Catering packages + “Request a Quote” form.
- `gallery.htm` — Photo gallery with a Jssor slider.
- `about-us.htm` — About copy.
- `contact-us.htm` — Phone numbers, location, and email link.
- `thankyou.htm` — Confirmation page after a successful quote request.
- `error.htm` — Error page shown when the quote request submission fails.

### Assets

- `css/`
  - `style.css` — Main theme stylesheet (Artisteer).
  - `style.ie6.css`, `style.ie7.css` — Legacy IE-specific styles.
- `js/`
  - `jquery.js` / `jquery-1.9.1.min.js` — jQuery used by the theme and gallery.
  - `script.js` — Theme behaviors (menu/vmenu, legacy IE fixes).
  - `jssor.slider.mini.js` — Gallery slider library.
- `images/` — Theme images, headers, UI graphics (e.g., quote button).
- `photos/` — Gallery images.

## Tech notes

- Markup is XHTML 1.0 Transitional.
- Theme styling and layout were generated with **Artisteer v3** (see `css/style.css` header).
- The gallery uses **Jssor Slider** and initializes via `jssor_1_slider_init()` embedded in `gallery.htm`.

## Quote form behavior

The quote form on `quote.htm` posts to an external hosted form handler (a server-side email script). It includes:

- Required field enforcement configured via hidden inputs (`required`, `order`).
- Destination email set via a hidden input (`my_email`).
- Redirect URLs for success/failure (`thankyou_url`, `error_url`).

If you’re previewing the site locally as static files, the form will still attempt to submit to that external endpoint (if reachable). If you intend to modernize this, replace the form action with your own backend or a maintained form provider.

## How to view the site

### Option A: Open directly in a browser

Because this is a static site, you can typically open `index.htm` directly.

### Option B: Serve the folder with a simple static server (recommended)

Serving the folder avoids some browser restrictions around local file access.

- **Python** (if installed):
  - From the project root: `python -m http.server 8000`
  - Then browse to: `http://127.0.0.1:8000/index.htm`

- **Node.js** (if installed):
  - `npx http-server -p 8000`
  - Then browse to: `http://127.0.0.1:8000/index.htm`

> Note: A VS Code task may exist in this workspace to open the site in Chrome, but the safest, most portable approach is to use one of the options above.

## Deployment

This project can be deployed to any static host.

- Upload the **entire** folder so relative links keep working.
- Preserve the directory structure (`css/`, `js/`, `images/`, `photos/`).
- Ensure the host serves `.htm` as HTML.

## Maintenance tips

- When editing navigation, update both the top menu (`ul.art-menu`) and the sidebar menu (`ul.art-vmenu`) on each page (they are duplicated in the markup).
- The gallery slider images are listed directly in `gallery.htm` as `<img data-u="image" src="photos/...">`.
- There are legacy IE6/IE7 styles and compatibility scripts included; remove only if you’re intentionally dropping support for those browsers.
