# Your Pricing Pro — yourpricing.pro

A small static site: the one-page home page plus a 404 page, two legal pages and a booking page. No frameworks, no build step: edit the files and push.

This file is the repo's only documentation. All work here is done by Claude Code, so it is written as instructions for that: the structure, the conventions, the release steps and what to check. `README.md` is a short stub for the GitHub repository page that points here.

## Ground rules

- **Don't change how the site looks, feels or behaves** unless the task asks for exactly that. A cleanup or refactor must leave every page pixel-identical, at every width, in light and dark mode.
- **Keep it plain**: hand-written HTML, CSS and JavaScript, no frameworks, no build step, no npm dependencies in the repo. `main.js` stays a classic script in an IIFE, not a module, so `index.html` still works when opened straight from disk.
- **Follow the conventions below** (class names, `is-` states, `data-` hooks, theme variables, range media queries, `px` units, semantic markup, image names). Match the surrounding code's style and comment density; tabs and LF line endings (`.editorconfig`).
- **Keep this file in step with the code.** When a change affects anything described here (files, conventions, building blocks, behaviour hooks, release steps), update it in the same commit. Keep the table of contents at the top of `style.css` and `main.js` current.

## Git

- GitHub Pages serves the `master` branch root. Work on `dev`, then open a PR `dev → master`; merging it deploys the site. Never commit or push to `master` directly, and never force-push.
- One logical change per commit, with a short imperative subject ("Rename images and licences, …") and a body when the reason isn't obvious.
- **Never name consulting clients** (the companies in the client-logo section) in commit messages or PR text. Say "client logos", not the company names.
- Commit, push and open PRs only when asked.
- `src/` (design sources and originals) and `.claude/` are local only and git-ignored; never add them.

## Files

```
index.html        the page
404.html          "page not found" in the About layout with its own photo, served by GitHub Pages for any missing URL (paths start from its <base>)
impressum/, privacy/   legal pages, each an index.html served at /impressum/ and /privacy/ (noindex, not in the sitemap; paths start from their <base>)
quick-call/       booking page with the Cal.com calendar, built like the legal pages; linked from nowhere (see "Booking page")
css/style.css     all styles (fonts and theme variables at the top)
js/main.js        all behaviour (no dependencies)
fonts/            Poppins, self-hosted (woff2, Latin and Latin Extended subsets)
images/           photos, favicons, link-preview image (og.jpg), diagram, client logos
licenses/         licences of the Poppins font and the Tabler icons
llms.txt, index.html.md   plain-text and Markdown versions of the page for LLMs
robots.txt, sitemap.xml, site.webmanifest, CNAME
.editorconfig, .gitattributes   formatting rules: tabs, LF line endings, final newline
CLAUDE.md         this file: all documentation
README.md         stub for the GitHub repository page, pointing here
src/              local only (git-ignored): design sources, original photos, the full Tabler icon set, original client logos
```

## Releasing

- **Asset versions.** Browsers and Cloudflare cache `style.css` and `main.js` for up to 4 hours. When a release changes either file, bump the `?v=` date on its links in every `.html` page (e.g. `css/style.css?v=2026-10-27`), so visitors fetch the new file along with the new page. For a second release on the same day, add a letter (`?v=2026-10-27b`).
- **Sitemap.** When a release changes the page's content, set `<lastmod>` in `sitemap.xml` to the release date. Google and Bing only trust `lastmod` if it changes when the content does.
- **Images.** A changed image gets a new file name, and every reference to it is updated (see "Images").

### Cloudflare settings (dashboard, not in this repo)

- **Cache rule** (Caching → Cache Rules): when the query string contains `v=`, or the URI path starts with `/fonts/`, set Edge TTL and Browser TTL to 1 year. Versioned CSS/JS and the fonts never change under the same URL. When the URI path starts with `/images/`, use 30 days; image names aren't versioned, so give a changed image a new file name.
- **Response header rule** (Rules → Transform Rules → Modify Response Header): when the URI path equals `/index.html.md`, set `Link` to `<https://yourpricing.pro/>; rel="canonical"`, so search engines treat the Markdown copy as a duplicate of the page instead of indexing it on its own (LLM crawlers can still read it).
- **Response header rule** (same place): when the URI path is in `/404.html`, `/impressum/`, `/impressum/index.html`, `/privacy/`, `/privacy/index.html`, `/quick-call/` or `/quick-call/index.html`, set `X-Robots-Tag` to `noindex`. A backup for the pages' own `noindex` meta tag. Don't block these pages in `robots.txt` instead: a crawler that can't fetch a page never sees its `noindex`, and may list the bare URL anyway.

## Copies to keep in sync

There is no template or build step, so some things exist in several files. Change every copy in the same commit.

- **Content.** The services, facts and contact details appear in four places: the page itself, the JSON-LD block in `<head>` (structured data for Google and Bing: who Pavel is, the business, the services), `index.html.md` and `llms.txt`.
- **Menu and footer** are copied into every `.html` page: `index.html`, `404.html`, `impressum/index.html`, `privacy/index.html`, `quick-call/index.html`, and any page added later, which gets the same menu and footer. The footer markup is identical in all of them (see "Footer"). The menu bar on every page but `index.html` has one extra class, `site-nav--shadow`: with no hero photo under it, the bar casts its shadow from the top of the page on desktop in light mode, as it does on the home page once it sticks.
- **Links** are the same on every page: relative, written from the site's root. The legal and booking pages sit one folder down, so a `<base href="../">` points them back at the root, and each has a `<link rel="canonical">` to its address with the trailing slash. Because GitHub Pages serves `404.html` at any depth, its links start from a `<base href="/">`, which a small inline script points at the file's own folder when the page is opened by name (a local server in a subfolder). `404.html` must stay at the root under that name, or GitHub Pages won't use it.

## Styling conventions

- **Theme values** (colours, font, card shadow, gutter) are CSS variables in `:root` at the top of `style.css`. Change the accent colour there, for example. A colour used in more than one place gets a variable too, even when it is the same in both themes (`--icon-on-accent`).
- **Dark mode** follows the visitor's device setting (`prefers-color-scheme`); there is no switch on the page. The dark values override the same variables in the `@media (prefers-color-scheme: dark)` block right below `:root`, so components only use the variables (`--ink`, `--on-accent`, `--bg-card`, …) instead of hard-coded `#000`/`#fff`. The few fixed colours are the same in both themes on purpose: white text and dots on the hero photos, the black menu bar on phones, the white icon circle on a hovered service card and the light footer text. A few image-specific tweaks sit next to their components: on desktop the hero photo is narrower and starts below the nav, so the light title sits on the grey page instead of the light wall in the photo, and the About and 404 photos are dimmed slightly. `images/pricing-cycle.svg` and the client logos carry their own dark colours in a `<style>` block, and the booking calendar gets its dark colours from its embed snippet (see "Booking page"). Every dark text colour pair passes WCAG AA (4.5:1). A `darkreader-lock` meta tag stops the Dark Reader extension darkening the page a second time.
- **Class names** describe what a thing is: `block`, `block_part`, `block--variant` (e.g. `service-card`, `service-card_icon`, `btn--primary`).
- **State classes** set by JavaScript start with `is-` (`is-sticky`, `is-visible`, `is-leaving`, `is-open`, `is-animating`, `is-active`, `is-revealed`).
- **JavaScript hooks** are `data-` attributes, so restyling never breaks behaviour.
- **Breakpoints**: sm 576px, md 768px, lg 992px, xl 1200px (listed at the top of `style.css`). Media queries use the range syntax: `(width >= 768px)` from md, `(width < 768px)` below md. `main.js` uses the same syntax in `matchMedia()`.
- **Units**: spacing and sizes are in `px`. Don't switch to `rem`: it would change how the page responds to a visitor's browser font-size setting. Only `.icon` uses `em`, so icons size with their text.
- **Browser support**: current Chrome, Edge, Safari and Firefox. The floor is set by `color-mix()` (Chrome 111, Firefox 113), range media queries (Safari 16.4) and `:has()` (Firefox 121; it locks the page scroll behind the open contact dialog). Don't use CSS nesting yet: it would raise Safari to 17.2.
- **Rules that look unused but aren't**: some `position`/`z-index`/`overflow` rules (`.stats`, `.about`, `.service-card_icon`, `.site-footer`) and the slider's `translate3d(0, 0, 0)`/`backface-visibility` change how the browser paints and anti-aliases those blocks, even though they don't move anything. Removing them, or swapping the slider's for `will-change`, shifts pixels. Each has a comment saying so; leave them. Before removing any CSS that looks unused, compare screenshots before and after.
- **Comments**: both `style.css` and `main.js` open with a numbered table of contents; keep it in step with the sections. Each rule or function gets a short comment when its purpose isn't obvious from its name.

## Markup conventions

- **Semantic elements**: repeated items are lists (`<ul>`/`<li>`: services, stats, interests, client logos), name/value pairs are a `<dl>` (the About details), the contact form is a `<dialog>`.
- **Images**: every `<img>` has `width` and `height` (the file's pixel size, so the browser reserves the space) and `decoding="async"`. Only the client logos have `loading="lazy"`: a jump to Contact must not show the CTA photo or the diagram late.
- **Links**: no `www.` in any URL (`https://linkedin.com/in/pavstor/`). Email links are plain `mailto:info@yourpricing.pro` with a prefilled subject.
- **IDs** are only for menu anchors (`…-section`, which are also shared links, so don't rename them), form labels and `aria-controls`/`aria-labelledby` targets. Styling uses classes, behaviour uses `data-` attributes.
- **One `<h1>` per page.** On the home page the first hero slide's title is the `<h1>`; other slides use `<p class="slide_title">`, which looks the same.

## Building blocks

### Section

```html
<section class="section" id="my-section">            <!-- add section--alt for the grey background -->
	<div class="container">
		<div class="section-text reveal">
			<span class="eyebrow">Label</span>
			<h2>Section title</h2>
			<p>Intro text…</p>
		</div>
		<!-- section content -->
	</div>
</section>
```

Link it from the menu by adding an `<li>` to `.site-nav_list` with `href="#my-section"` (on every page, see "Copies to keep in sync"). Menu links scroll smoothly to the section and stop just below the sticky navbar.

On a page without a hero photo (the legal and booking pages, and `404.html`), the first section also gets `section--page-top`: it keeps the same 96px gap below the menu bar at every width. From 992px the bar lies over the top of the page, so the rule adds the bar's 82px height; if the menu bar's height changes, change that number too. `404.html` uses it only below 992px: from there its photo and text are centred in the window instead.

### Service card

Add another card inside `.services` (the grid places 1 / 2 / 4 per row automatically):

```html
<li class="service-card">
	<div class="service-card_icon"><svg class="icon" …></svg></div>
	<h3>Title</h3>
	<p>Description.</p>
</li>
```

### Stat (counter)

Add inside the `.stats_grid` list. The number counts up from 0 to `data-count`. The final value also sits in a `.visually-hidden` span, so screen readers and search engines get the real number rather than the 0 the animation starts from:

```html
<li class="stat reveal">
	<div class="stat_icon"><svg class="icon" …></svg></div>
	<div class="stat_text">
		<strong class="stat_number"><span data-count="42" aria-hidden="true">0</span><span class="visually-hidden">42</span></strong>
		<span class="stat_label">Label</span>
	</div>
</li>
```

### Client logo

Add an `<li>` inside `.clients`. Logos are made from the companies' official files (sources and brand rules in `src/clients/SOURCES.md`), cropped to the artwork in `images/clients/`. Each logo is one SVG that carries its own dark colours in a `<style>` block, like `pricing-cycle.svg`:

```html
<li class="client client--acme reveal">
	<img src="images/clients/acme.svg" alt="Acme" width="120" height="40" loading="lazy" decoding="async">
</li>
```

Then give `.client--acme` in `style.css` a width (`--w`, for phones and from md, chosen so it looks as heavy as the others rather than as wide) and its float timing (`--float-y`, `--float-x`, `--float-delay`). The spots in the cloud belong to positions, not logos: `.client:nth-child(n)` sets each spot's place on the 12-column grid from md (`grid-area`) and its nudge (`--x`, `--y`), so another logo also needs another spot. `data-shuffle` on the list puts the logos in a random order on every load, and each one drifts gently unless the visitor has turned on "reduce motion".

### Hero slide

Copy the second `.slide` inside `.hero-slider` (its title is a `<p class="slide_title">`: the first slide holds the page's only `<h1>`). The slider loops, autoplays every 5s, pauses on hover, can be swiped on touch screens, and creates one dot per slide. For the seamless loop `main.js` adds copies of the slides on both sides; it hides them from screen readers and the Tab key and turns their `<h1>` into a `<p>`, so edit only the slides in `index.html`.

Below 992px the photo fills the full width, and `style.css` shifts it so the person stands in the middle of the slide. The rule assumes he stands at 58% of the photo's width and that the photos are 2600×1985, as both hero photos are now. A new photo with the person elsewhere, or with other proportions, needs those numbers changed (the `0.08` is 0.58 − 0.5).

### Footer

Every page has the same footer, on one line at every width: the copyright on the left, the legal links on the right. Below 373px the text shrinks a little (to 12px at 320px wide) so the line still fits.

```html
<footer class="site-footer">
	<div class="container site-footer_inner">
		<p>&copy; <span data-year>2026</span> Pavel Storozhuk</p>
		<nav aria-label="Legal">
			<ul class="site-footer_links">
				<li><a href="impressum/">Impressum</a></li>
				<li><a href="privacy/">Privacy</a></li>
			</ul>
		</nav>
	</div>
</footer>
```

Each page holds its own copy, so a change to the footer goes into every `.html` page in the same commit (see "Copies to keep in sync"). If the text changes, update the footer line of `index.html.md` too.

Pages that can be shorter than the window (`404.html`, `impressum/index.html`, `privacy/index.html`, `quick-call/index.html`) have `class="page-fill"` on `<body>`, which keeps the footer at the bottom of the window however little content there is. A new page gets that class as well. `index.html` is always taller than the window and doesn't need it.

### Booking page

`quick-call/index.html` is the link Pavel sends to prospects who want a call: yourpricing.pro/quick-call/. It shows the Cal.com event `pavel-storozhuk/quick-zoom` as an inline calendar. On purpose, nothing links to it: not the menu, the footer, the sitemap, `llms.txt` or `index.html.md`. Like the legal pages it is `noindex`, and it isn't blocked in `robots.txt`, so search engines can read that.

- Cal.com's embed snippet is inline at the bottom of the page, pointed at `[data-booking]`, so no other page loads anything from Cal.com. The `privacy/index.html` section "Booking a call" says so; keep it true.
- The calendar follows the visitor's light or dark setting. Its orange (`cal-brand`) is set per theme in the snippet's `ui` call, and in dark mode its backgrounds (`cal-bg`, `cal-bg-muted`) repeat the dark `--bg` and its day buttons (`cal-bg-emphasis`) `--bg-card`, so the calendar sits on the page instead of in a darker box. Change them together with those variables. `.booking_calendar` sets `color-scheme` to a single value (`light` or `dark`): Cal.com's script passes it into the iframe only then, and without it Chrome paints a white backdrop behind the calendar in dark mode. The page's `darkreader-lock` doesn't reach into the iframe, so a visitor's dark-mode extension can still recolour the calendar; that isn't a bug on the page.
- `forwardQueryParams` passes the page's query string on, so `quick-call/?name=Jane%20Doe&email=jane@example.com` opens the booking form already filled in.
- `.booking_calendar` keeps 600px free while the calendar loads, so the footer doesn't jump. Without JavaScript a `<noscript>` link to the same event on cal.com shows instead.

### Buttons

`btn btn--primary` (orange), `btn btn--white` (white on orange), plus `btn--large` for more padding.

### Icons

Every icon comes from [Tabler Icons](https://tabler.io/icons) (outline style, v3.31, MIT licence), so they all share one look. Browse and search the set at tabler.io/icons and download the outline SVG (a local copy of the whole set is in `src/icons/tabler/`). The licence is in `licenses/tabler-icons.txt`.

Icons are inline SVG with class `icon`; they take their size from `font-size` and colour from `color`, like an icon font. The `.icon` rule draws them as 1.5px lines with rounded ends, so copy only the `d` values of the file's `<path>` elements (skip the first, `M0 0h24v24H0z`, an invisible bounding box) into one path:

```html
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8l-4 4l4 4 M17 8l4 4l-4 4 M14 4l-4 16" /></svg>
```

Don't mix in icons from other sets (Font Awesome, Flaticon, …): that's how the page ended up with three different styles before.

## Behaviour (js/main.js)

| Hook | What it does |
|---|---|
| `data-slider` | Hero slider |
| `data-nav` | Navbar becomes fixed after 150px of scrolling, slides in after 350px, slides out when scrolling back up |
| `data-nav-toggle` | Mobile menu button; animates the menu named by its `aria-controls` open/closed and closes it when one of its links is followed |
| `.reveal` | Fades the element up when it scrolls into view (staggered by 50ms) |
| `data-shuffle` | Puts the element's children in a random order on every page load (the client logos) |
| `data-counters` / `data-count` | Counts numbers up over 7s when the section scrolls into view |
| `data-contact` | Opens the contact form in a modal dialog instead of following the `mailto:` link (which stays as the fallback without JavaScript); the form posts to web3forms |
| `data-year` | Filled with the current year |

## Images

- **Names** say where the image appears: `hero-1.webp`, `hero-2.webp`, `about.webp`, `about.jpg`, `cta.webp`, `404.webp`, `og.jpg` and `clients/<company>.svg`. Cloudflare caches images for 30 days by name, so a changed image gets a new name (e.g. `about-2.webp`), and every reference to it is updated (`index.html`, the JSON-LD, `robots.txt`, this file).
- **Photos on the page are WebP**, which every supported browser shows, so no fallback is needed. Make them from the originals in `src/` with `cwebp -q 85 -m 6 -sharp_yuv -metadata icc` (the CTA photo, which is transparent, also with `-alpha_q 100 -exact`). If the source is a PNG, cwebp drops its colour profile; add it back with `webpmux -set icc srgb.icc`. The 404 photo is scaled to 1400px wide (`-resize 1400 1918`): it never shows wider than 690 CSS px, so this is still sharp on 2x screens. If its proportions change, update the ratio in the `.not-found` comment and the `min-height`s in `style.css`. `about.jpg` and `og.jpg` stay JPEG: the first is the `image` in the JSON-LD, the second the link preview, and link-preview crawlers don't all read WebP.
- **No metadata but the colour profile.** Photo editors and cameras write the author, editing dates, source file names and the camera's and lens's serial numbers into the file. `-metadata icc` (cwebp) and `-copy icc` (jpegtran) keep only the colour profile, so run every new photo through one of them before committing, even if it needs no other change.
- **Optimise losslessly** before committing, keeping the format and the sRGB colour profile:
  - PNG: `oxipng -o max --strip safe file.png`
  - JPEG: `jpegtran -copy icc -optimize -progressive -outfile out.jpg in.jpg`
  - SVG: svgo with `floatPrecision: 10` and `convertColors`, `inlineStyles`, `minifyStyles`, `mergePaths`, `convertPathData`, `convertTransform` and `convertShapeToPath` turned off. Rounding path data shifts anti-aliasing, and the dark styles in `pricing-cycle.svg` and the client logos match their exact `fill` values.

  Keep a result only if it is smaller and renders identically.
- **Originals** (full-size photos, design files, logo sources) stay in the git-ignored `src/`, not in the repo.

## Search engines and link previews

- **Keep the privacy policy true.** `privacy/index.html` names every provider that receives visitors' data (hosting, delivery, the contact form, email, the booking page and its video calls) and says the site sets no cookies, apart from Cal.com's on the booking page, and uses no analytics. Adding or changing a provider, a cookie or a tracker means updating it and its date in the same commit. Cloudflare's Bot Fight Mode sets a cookie, so it stays off.
- **Link previews** use the Open Graph tags in `<head>` and `images/og.jpg` (1200×630, cropped from the first hero photo). After changing either, re-check a link with the [LinkedIn Post Inspector](https://linkedin.com/post-inspector/), which also refreshes LinkedIn's cache.
- **Favicons** live in `images/favicon/`. `favicon.svg` is the one modern browsers use: transparent in light mode, on a white rounded square in dark mode. `favicon.ico` (16/32/48), `apple-touch-icon.png` (180) and `icon-192/512.png` (for `site.webmanifest` and the JSON-LD logo) are black on white, rendered from the same artwork.
- **robots.txt** keeps every WebP (the photos on the page) and the client logos out of image search. `about.jpg` stays crawlable: it is the `image` in the JSON-LD. `og.jpg` is blocked only for Google Images (`Googlebot-Image`, which follows only its own group, so that group repeats the general rules): LinkedIn's and X's link-preview bots obey robots.txt, and blocking it for every crawler would drop the image from shared links.

## Checking a change

There is no test suite. Before calling a change done, check it in the built-in browser: start the `site` preview (`.claude/launch.json`, port 8765; outside Claude Code, `python3 -m http.server` and http://localhost:8000). Opening `index.html` straight from disk works too, but the footer links then show a folder listing instead of the legal pages. The site should look and behave the same unless the change is meant to alter it. Check:

- Widths on both sides of each breakpoint (e.g. 375, 767/768, 991/992, 1199/1200 and 1440px), in light and dark mode, and once with "reduce motion" on.
- The slider (autoplay, dots, swipe), the sticky navbar, the mobile menu, the counters, the reveal animations and the contact dialog (open, Esc, send).
- `404.html` (from 992px the photo and text centred between menu bar and footer, the head never cropped, also in a short window; below that the smaller square photo, centred, under the same 96px gap as the other pages), `impressum/index.html`, `privacy/index.html` and `quick-call/index.html` (the calendar loads, in both themes), and that the console shows no errors and no request returns 404.
- For a change that touches painting, stacking or transforms, compare screenshots before and after.

Report what you checked, and anything you couldn't.
