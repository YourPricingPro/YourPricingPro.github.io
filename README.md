# Your Pricing Pro — yourpricing.pro

One-page static site. No frameworks, no build step: edit the files and push.

```
index.html        the page
404.html          "page not found", served by GitHub Pages for any missing URL (absolute paths only)
css/style.css     all styles (fonts and theme variables at the top)
js/main.js        all behaviour (no dependencies)
fonts/            Poppins, self-hosted (woff2, Latin and Latin Extended subsets) and its licence
images/           photos, favicons, link-preview image (og.jpg), diagram, client logos, Tabler icon licence
llms.txt, index.html.md   plain-text and Markdown versions of the page for LLMs
robots.txt, sitemap.xml, site.webmanifest, CNAME
.editorconfig, .gitattributes   formatting rules: tabs, LF line endings, final newline
src/              local only (git-ignored): design sources, original photos, the full Tabler icon set, original client logos
```

## Publishing

GitHub Pages serves the `master` branch root. Work on `dev`, then open a PR `dev → master`; merging it deploys the site.

Browsers and Cloudflare cache `style.css` and `main.js` for up to 4 hours. When a release changes either file, bump the `?v=` date on its links in `index.html` and `404.html` (e.g. `css/style.css?v=2026-10-27`), so visitors fetch the new file along with the new page. For a second release on the same day, add a letter (`?v=2026-10-27b`).

When a release changes the page's content, set `<lastmod>` in `sitemap.xml` to the release date. Google and Bing only trust `lastmod` if it changes when the content does.

### Cloudflare settings (dashboard, not in this repo)

- **Cache rule** (Caching → Cache Rules): when the query string contains `v=`, or the URI path starts with `/fonts/`, set Edge TTL and Browser TTL to 1 year. Versioned CSS/JS and the fonts never change under the same URL. When the URI path starts with `/images/`, use 30 days; image names aren't versioned, so give a changed image a new file name.
- **Response header rule** (Rules → Transform Rules → Modify Response Header): when the URI path equals `/index.html.md`, set `Link` to `<https://yourpricing.pro/>; rel="canonical"`, so search engines treat the Markdown copy as a duplicate of the page instead of indexing it on its own (LLM crawlers can still read it).

To preview locally, open `index.html` in a browser, or serve the folder (`python3 -m http.server`) and open http://localhost:8000.

## Styling conventions

- **Theme values** (colours, font, card shadow, gutter) are CSS variables in `:root` at the top of `style.css`. Change the accent colour there, for example.
- **Dark mode** follows the visitor's device setting (`prefers-color-scheme`); there is no switch on the page. The dark values override the same variables in the `@media (prefers-color-scheme: dark)` block right below `:root`, so components only use the variables (`--ink`, `--on-accent`, `--bg-card`, …) instead of hard-coded `#000`/`#fff`. A few image-specific tweaks sit next to their components: on desktop the hero photo is narrower and starts below the nav, so the light title sits on the grey page instead of the light wall in the photo, and the About photo is dimmed slightly. `images/pricing-cycle.svg` carries its own dark colours in a `<style>` block. Every dark text colour pair passes WCAG AA (4.5:1). A `darkreader-lock` meta tag stops the Dark Reader extension darkening the page a second time.
- **Class names** describe what a thing is: `block`, `block_part`, `block--variant` (e.g. `service-card`, `service-card_icon`, `btn--primary`).
- **State classes** set by JavaScript start with `is-` (`is-sticky`, `is-visible`, `is-leaving`, `is-open`, `is-animating`, `is-active`, `is-revealed`).
- **JavaScript hooks** are `data-` attributes, so restyling never breaks behaviour.
- **Breakpoints**: sm 576px, md 768px, lg 992px, xl 1200px (listed at the top of `style.css`).

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

Add an `<li>` inside `.clients`. Logos are the companies' official files (sources and brand rules in `src/clients/SOURCES.md`), cropped to the artwork in `images/clients/`, with a separate file for dark backgrounds:

```html
<li class="client client--acme reveal">
	<picture>
		<source media="(prefers-color-scheme: dark)" srcset="images/clients/acme-dark.svg">
		<img src="images/clients/acme.svg" alt="Acme" width="120" height="40" loading="lazy" decoding="async">
	</picture>
</li>
```

Then give `.client--acme` in `style.css` a width (`--w`, for phones and from md, chosen so it looks as heavy as the others rather than as wide) and its float timing (`--float-y`, `--float-x`, `--float-delay`). The spots in the cloud belong to positions, not logos: `.client:nth-child(n)` sets each spot's place on the 12-column grid from md (`grid-area`) and its nudge (`--x`, `--y`), so another logo also needs another spot. `data-shuffle` on the list puts the logos in a random order on every load, and each one drifts gently unless the visitor has turned on "reduce motion".

### Hero slide

Copy the second `.slide` inside `.hero-slider` (its title is a `<p class="slide_title">`: the first slide holds the page's only `<h1>`). The slider loops, autoplays every 5s, pauses on hover, can be swiped on touch screens, and creates one dot per slide.

### Buttons

`btn btn--primary` (orange), `btn btn--white` (white on orange), plus `btn--large` for more padding.

### Icons

Every icon comes from [Tabler Icons](https://tabler.io/icons) (outline style, v3.31, MIT licence), so they all share one look. Browse and search the set at tabler.io/icons and download the outline SVG (a local copy of the whole set is in `src/icons/tabler/`). The licence is in `images/icons/tabler-LICENSE`.

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
| `data-nav-toggle="#id"` | Mobile menu button; animates the target open/closed and closes it when one of its links is followed |
| `.reveal` | Fades the element up when it scrolls into view (staggered by 50ms) |
| `data-shuffle` | Puts the element's children in a random order on every page load (the client logos) |
| `data-counters` / `data-count` | Counts numbers up over 7s when the section scrolls into view |
| `data-contact` | Opens the contact form in a modal dialog instead of following the `mailto:` link (which stays as the fallback without JavaScript); the form posts to web3forms |
| `data-year` | Filled with the current year |

## Search engines and link previews

- **Keep the copies in sync.** The services, facts and contact details appear in four places: the page itself, the JSON-LD block in `<head>` (structured data for Google and Bing: who Pavel is, the business, the services), `index.html.md` and `llms.txt`. Change one, change all. Likewise the menu and footer, which `404.html` repeats (with absolute links).
- **One `<h1>` per page.** The first hero slide's title is the `<h1>`; other slides use `<p class="slide_title">`, which looks the same.
- **Link previews** use the Open Graph tags in `<head>` and `images/og.jpg` (1200×630, cropped from `bg_1.jpg`). After changing either, re-check a link with the [LinkedIn Post Inspector](https://linkedin.com/post-inspector/), which also refreshes LinkedIn's cache.
- **Favicons** live in `images/favicon/`. `favicon.svg` is the one modern browsers use: transparent in light mode, on a white rounded square in dark mode. `favicon.ico` (16/32/48), `apple-touch-icon.png` (180) and `icon-192/512.png` (for `site.webmanifest` and the JSON-LD logo) are black on white, rendered from the same artwork.
- **robots.txt** keeps the hero photos, the CTA photo and the client logos out of image search. `about-1.jpg` and `og.jpg` stay crawlable: the About photo is an `<img>` (search engines skip CSS backgrounds) and is the `image` in the JSON-LD.
