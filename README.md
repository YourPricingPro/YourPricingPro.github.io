# Your Pricing Pro — yourpricing.pro

One-page static site. No frameworks, no build step: edit the files and push.

```
index.html        the page
404.html          "page not found", served by GitHub Pages for any missing URL (paths start from its <base>)
impressum.html, privacy.html   legal pages (noindex, not in the sitemap)
css/style.css     all styles (fonts and theme variables at the top)
js/main.js        all behaviour (no dependencies)
fonts/            Poppins, self-hosted (woff2, Latin and Latin Extended subsets)
images/           photos, favicons, link-preview image (og.jpg), diagram, client logos
licenses/         licences of the Poppins font and the Tabler icons
llms.txt, index.html.md   plain-text and Markdown versions of the page for LLMs
robots.txt, sitemap.xml, site.webmanifest, CNAME
.editorconfig, .gitattributes   formatting rules: tabs, LF line endings, final newline
CLAUDE.md         instructions for AI coding agents (builds on this README)
src/              local only (git-ignored): design sources, original photos, the full Tabler icon set, original client logos
```

## Publishing

GitHub Pages serves the `master` branch root. Work on `dev`, then open a PR `dev → master`; merging it deploys the site.

Browsers and Cloudflare cache `style.css` and `main.js` for up to 4 hours. When a release changes either file, bump the `?v=` date on its links in every `.html` page (e.g. `css/style.css?v=2026-10-27`), so visitors fetch the new file along with the new page. For a second release on the same day, add a letter (`?v=2026-10-27b`).

When a release changes the page's content, set `<lastmod>` in `sitemap.xml` to the release date. Google and Bing only trust `lastmod` if it changes when the content does.

### Cloudflare settings (dashboard, not in this repo)

- **Cache rule** (Caching → Cache Rules): when the query string contains `v=`, or the URI path starts with `/fonts/`, set Edge TTL and Browser TTL to 1 year. Versioned CSS/JS and the fonts never change under the same URL. When the URI path starts with `/images/`, use 30 days; image names aren't versioned, so give a changed image a new file name.
- **Response header rule** (Rules → Transform Rules → Modify Response Header): when the URI path equals `/index.html.md`, set `Link` to `<https://yourpricing.pro/>; rel="canonical"`, so search engines treat the Markdown copy as a duplicate of the page instead of indexing it on its own (LLM crawlers can still read it).

To preview locally, open `index.html` in a browser, or serve the folder (`python3 -m http.server`) and open http://localhost:8000.

## Styling conventions

- **Theme values** (colours, font, card shadow, gutter) are CSS variables in `:root` at the top of `style.css`. Change the accent colour there, for example. A colour used in more than one place gets a variable too, even when it is the same in both themes (`--icon-on-accent`).
- **Dark mode** follows the visitor's device setting (`prefers-color-scheme`); there is no switch on the page. The dark values override the same variables in the `@media (prefers-color-scheme: dark)` block right below `:root`, so components only use the variables (`--ink`, `--on-accent`, `--bg-card`, …) instead of hard-coded `#000`/`#fff`. The few fixed colours are the same in both themes on purpose: white text and dots on the hero photos, the black menu bar on phones, the white icon circle on a hovered service card and the light footer text. A few image-specific tweaks sit next to their components: on desktop the hero photo is narrower and starts below the nav, so the light title sits on the grey page instead of the light wall in the photo, and the About photo is dimmed slightly. `images/pricing-cycle.svg` and the client logos carry their own dark colours in a `<style>` block. Every dark text colour pair passes WCAG AA (4.5:1). A `darkreader-lock` meta tag stops the Dark Reader extension darkening the page a second time.
- **Class names** describe what a thing is: `block`, `block_part`, `block--variant` (e.g. `service-card`, `service-card_icon`, `btn--primary`).
- **State classes** set by JavaScript start with `is-` (`is-sticky`, `is-visible`, `is-leaving`, `is-open`, `is-animating`, `is-active`, `is-revealed`).
- **JavaScript hooks** are `data-` attributes, so restyling never breaks behaviour.
- **Breakpoints**: sm 576px, md 768px, lg 992px, xl 1200px (listed at the top of `style.css`). Media queries use the range syntax: `(width >= 768px)` from md, `(width < 768px)` below md. `main.js` uses the same syntax in `matchMedia()`.
- **Units**: spacing and sizes are in `px`. Don't switch to `rem`: it would change how the page responds to a visitor's browser font-size setting. Only `.icon` uses `em`, so icons size with their text.
- **Browser support**: current Chrome, Edge, Safari and Firefox. The floor is set by `color-mix()` (Chrome 111, Firefox 113), range media queries (Safari 16.4) and `:has()` (Firefox 121; it locks the page scroll behind the open contact dialog). Don't use CSS nesting yet: it would raise Safari to 17.2.
- **Rules that look unused but aren't**: some `position`/`z-index`/`overflow` rules (`.stats`, `.about`, `.service-card_icon`, `.site-footer`) and the slider's `translate3d(0, 0, 0)`/`backface-visibility` change how the browser paints and anti-aliases those blocks, even though they don't move anything. Removing them, or swapping the slider's for `will-change`, shifts pixels. Each has a comment saying so; leave them.
- **Comments**: both `style.css` and `main.js` open with a numbered table of contents; keep it in step with the sections. Each rule or function gets a short comment when its purpose isn't obvious from its name.

## Markup conventions

- **Semantic elements**: repeated items are lists (`<ul>`/`<li>`: services, stats, interests, client logos), name/value pairs are a `<dl>` (the About details), the contact form is a `<dialog>`.
- **Images**: every `<img>` has `width` and `height` (the file's pixel size, so the browser reserves the space) and `decoding="async"`. Only the client logos have `loading="lazy"`: a jump to Contact must not show the CTA photo or the diagram late.
- **Links**: no `www.` in any URL (`https://linkedin.com/in/pavstor/`). Email links are plain `mailto:info@yourpricing.pro` with a prefilled subject.
- **IDs** are only for menu anchors (`…-section`, which are also shared links, so don't rename them), form labels and `aria-controls`/`aria-labelledby` targets. Styling uses classes, behaviour uses `data-` attributes.

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

Link it from the menu by adding an `<li>` to `.site-nav_list` with `href="#my-section"`. Menu links scroll smoothly to the section and stop just below the sticky navbar.

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

### Footer

Every page has the same footer, on one line at every width: the copyright on the left, the legal links on the right. Below 373px the text shrinks a little (to 12px at 320px wide) so the line still fits.

```html
<footer class="site-footer">
	<div class="container site-footer_inner">
		<p>&copy; <span data-year>2026</span> Pavel Storozhuk</p>
		<nav aria-label="Legal">
			<ul class="site-footer_links">
				<li><a href="impressum.html">Impressum</a></li>
				<li><a href="privacy.html">Privacy</a></li>
			</ul>
		</nav>
	</div>
</footer>
```

There is no template, so each page holds its own copy. **Any change to the footer goes into every `.html` page in the same commit** (`index.html`, `404.html`, `impressum.html`, `privacy.html`, and any page added later); the markup is identical in all of them. If the text changes, update the footer line of `index.html.md` too.

Pages that can be shorter than the window (`404.html`, `impressum.html`, `privacy.html`) have `class="page-fill"` on `<body>`, which keeps the footer at the bottom of the window however little content there is. A new page gets that class as well. `index.html` is always taller than the window and doesn't need it.

### Buttons

`btn btn--primary` (orange), `btn btn--white` (white on orange), plus `btn--large` for more padding.

### Icons

Every icon comes from [Tabler Icons](https://tabler.io/icons) (outline style, v3.31, MIT licence), so they all share one look. Browse and search the set at tabler.io/icons and download the outline SVG (a local copy of the whole set is in `src/icons/tabler/`). The licence is in `licenses/tabler-icons.txt`.

Icons are inline SVG with class `icon`; they take their size from `font-size` and colour from `color`, like an icon font. The `.icon` rule draws them as 1.5px lines with rounded ends, so copy only the `d` values of the file's `<path>` elements (skip the first, `M0 0h24v24H0z`, an invisible bounding box) into one path:

```html
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8l-4 4l4 4 M17 8l4 4l-4 4 M14 4l-4 16" /></svg>
```

Don't mix in icons from other sets (Font Awesome, Flaticon, …): that's how the page ended up with three different styles before.

## Images

- **Names** say where the image appears: `hero-1.jpg`, `hero-2.jpg`, `about.jpg`, `cta.png`, `og.jpg` and `clients/<company>.svg`. Cloudflare caches images for 30 days by name, so a changed image gets a new name (e.g. `about-2.jpg`), and every reference to it is updated (`index.html`, the JSON-LD, `robots.txt`, this README).
- **Optimise losslessly** before committing, keeping the format and the sRGB colour profile:
  - PNG: `oxipng -o max --strip safe file.png`
  - JPEG: `jpegtran -copy icc -optimize -progressive -outfile out.jpg in.jpg`
  - SVG: svgo with `floatPrecision: 10` and `convertColors`, `inlineStyles`, `minifyStyles`, `mergePaths`, `convertPathData`, `convertTransform` and `convertShapeToPath` turned off. Rounding path data shifts anti-aliasing, and the dark styles in `pricing-cycle.svg` and the client logos match their exact `fill` values.

  Keep a result only if it is smaller and renders identically.
- **Originals** (full-size photos, design files, logo sources) stay in the git-ignored `src/`, not in the repo.

## Checking a change

There is no test suite. The site should look and behave the same unless a change is meant to alter it, so check in a browser:

- Widths on both sides of each breakpoint (e.g. 375, 767/768, 991/992, 1199/1200 and 1440px), in light and dark mode, and once with "reduce motion" on.
- The slider (autoplay, dots, swipe), the sticky navbar, the mobile menu, the counters, the reveal animations and the contact dialog (open, Esc, send).
- `404.html`, `impressum.html` and `privacy.html`, and that the console shows no errors and no request returns 404.

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

## Search engines and link previews

- **Keep the copies in sync.** The services, facts and contact details appear in four places: the page itself, the JSON-LD block in `<head>` (structured data for Google and Bing: who Pavel is, the business, the services), `index.html.md` and `llms.txt`. Change one, change all. Likewise the menu and [footer](#footer), which `404.html`, `impressum.html` and `privacy.html` repeat. All three use relative links; because GitHub Pages serves `404.html` at any depth, its links start from a `<base href="/">`, which a small inline script points at the file's own folder when the page is opened by name (a local server in a subfolder).
- **Keep the privacy policy true.** `privacy.html` names every provider that receives visitors' data (hosting, delivery, the contact form, email) and says the site sets no cookies and uses no analytics. Adding or changing a provider, a cookie or a tracker means updating it and its date in the same commit. Cloudflare's Bot Fight Mode sets a cookie, so it stays off.
- **One `<h1>` per page.** The first hero slide's title is the `<h1>`; other slides use `<p class="slide_title">`, which looks the same.
- **Link previews** use the Open Graph tags in `<head>` and `images/og.jpg` (1200×630, cropped from `hero-1.jpg`). After changing either, re-check a link with the [LinkedIn Post Inspector](https://linkedin.com/post-inspector/), which also refreshes LinkedIn's cache.
- **Favicons** live in `images/favicon/`. `favicon.svg` is the one modern browsers use: transparent in light mode, on a white rounded square in dark mode. `favicon.ico` (16/32/48), `apple-touch-icon.png` (180) and `icon-192/512.png` (for `site.webmanifest` and the JSON-LD logo) are black on white, rendered from the same artwork.
- **robots.txt** keeps the hero photos, the CTA photo and the client logos out of image search. `about.jpg` and `og.jpg` stay crawlable: the About photo is an `<img>` (search engines skip CSS backgrounds) and is the `image` in the JSON-LD.
