# Your Pricing Pro — yourpricing.pro

One-page static site. No frameworks, no build step: edit the files and push.

```
index.html        the page
css/style.css     all styles (theme variables at the top)
js/main.js        all behaviour (no dependencies)
images/           photos, favicon, diagram, Tabler icon licence
llms.txt, index.html.md   plain-text and Markdown versions of the page for LLMs
robots.txt, sitemap.xml, CNAME
.editorconfig, .gitattributes   formatting rules: tabs, LF line endings, final newline
src/              local only (git-ignored): design sources, original photos, the full Tabler icon set
```

## Publishing

GitHub Pages serves the `master` branch root. Work on `dev`, then open a PR `dev → master`; merging it deploys the site.

Browsers and Cloudflare cache `style.css` and `main.js` for up to 4 hours. When a release changes either file, bump the `?v=` date on its link in `index.html` (e.g. `css/style.css?v=2026-10-27`), so visitors fetch the new file along with the new page. For a second release on the same day, add a letter (`?v=2026-10-27b`).

To preview locally, open `index.html` in a browser, or serve the folder (`python3 -m http.server`) and open http://localhost:8000.

## Styling conventions

- **Theme values** (colours, font, card shadow, gutter) are CSS variables in `:root` at the top of `style.css`. Change the accent colour there, for example.
- **Dark mode** follows the visitor's device setting (`prefers-color-scheme`); there is no switch on the page. The dark values override the same variables in the `@media (prefers-color-scheme: dark)` block right below `:root`, so components only use the variables (`--ink`, `--on-accent`, `--bg-card`, …) instead of hard-coded `#000`/`#fff`. A few image-specific tweaks sit next to their components: on desktop the hero photo is narrower and starts below the nav, so the light title sits on the grey page instead of the light wall in the photo, and the About photo is dimmed slightly. `images/pricing-cycle.svg` carries its own dark colours in a `<style>` block. Every dark text colour pair passes WCAG AA (4.5:1). A `darkreader-lock` meta tag stops the Dark Reader extension darkening the page a second time.
- **Class names** describe what a thing is: `block`, `block_part`, `block--variant` (e.g. `service-card`, `service-card_icon`, `btn--primary`).
- **State classes** set by JavaScript start with `is-` (`is-sticky`, `is-open`, `is-active`, `is-revealed`).
- **JavaScript hooks** are `data-` attributes, so restyling never breaks behaviour.
- **Breakpoints**: md 768px, lg 992px, xl 1200px (listed at the top of `style.css`).

## Building blocks

### Section

```html
<section class="section" id="my-section">            <!-- add section--alt for the grey background -->
	<div class="container">
		<div class="section-heading reveal">
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
<div class="service-card">
	<div class="service-card_icon"><svg class="icon" …></svg></div>
	<h3>Title</h3>
	<p>Description.</p>
</div>
```

### Stat (counter)

Add inside `.stats_grid`. The number counts up from 0 to `data-count`:

```html
<div class="stat reveal">
	<div class="stat_icon"><svg class="icon" …></svg></div>
	<div class="stat_text">
		<strong class="stat_number" data-count="42">0</strong>
		<span class="stat_label">Label</span>
	</div>
</div>
```

### Hero slide

Copy a `.slide` inside `.hero-slider`. The slider loops, autoplays every 5s, pauses on hover, can be swiped on touch screens, and creates one dot per slide.

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
| `data-counters` / `data-count` | Counts numbers up over 7s when the section scrolls into view |
| `data-contact` | Opens the contact form in a modal dialog instead of following the `mailto:` link (which stays as the fallback without JavaScript); the form posts to web3forms |
| `data-year` | Filled with the current year |
