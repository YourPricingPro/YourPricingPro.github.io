# Your Pricing Pro — yourpricing.pro

One-page static site. No frameworks, no build step: edit the files and push.

```
index.html        the page
css/style.css     all styles (theme variables at the top)
js/main.js        all behaviour (no dependencies)
images/           photos, service icons, favicon, diagram
llms.txt, index.html.md, robots.txt, sitemap.xml, CNAME
```

## Publishing

GitHub Pages serves the `master` branch root. Work on `dev`, then open a PR `dev → master`; merging it deploys the site.

To preview locally, open `index.html` in a browser, or serve the folder (`python3 -m http.server`) and open http://localhost:8000.

## Styling conventions

- **Theme values** (colours, font, card shadow, gutter) are CSS variables in `:root` at the top of `style.css`. Change the accent colour there, for example.
- **Class names** describe what a thing is: `block`, `block__part`, `block--variant` (e.g. `service-card`, `service-card__icon`, `btn--primary`).
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

Link it from the menu by adding an `<li>` to `.site-nav__list` pointing at `#my-section`.

### Service card

Add another card inside `.services` (the grid places 1 / 2 / 4 per row automatically):

```html
<div class="service-card">
	<div class="service-card__icon"><img src="images/icons/strategy.png" alt="…"></div>
	<h3>Title</h3>
	<p>Description.</p>
</div>
```

### Stat (counter)

Add inside `.stats__grid`. The number counts up from 0 to `data-count`:

```html
<div class="stat reveal">
	<div class="stat__icon"><svg class="icon" …></svg></div>
	<div class="stat__text">
		<strong class="stat__number" data-count="42">0</strong>
		<span class="stat__label">Label</span>
	</div>
</div>
```

### Hero slide

Copy a `.slide` inside `.hero-slider`. The slider loops, autoplays every 5s, pauses on hover, can be swiped on touch screens, and creates one dot per slide.

### Buttons

`btn btn--primary` (orange), `btn btn--white` (white on orange), plus `btn--large` for more padding.

### Photos

Each photo has a smaller modern copy next to the original, which stays as the fallback for older browsers: `bg_1`, `bg_2` and `about-1` have an `.avif`, and the transparent `author.png` has a `.webp`. When replacing a photo, replace both files. Background photos list them with `image-set()` (keep the plain `url(….jpg)` before it for browsers without `type()` support); the CTA photo uses `<picture>`. To make the copies:

```
ffmpeg -i bg_1.jpg -vf "scale=out_range=tv:out_color_matrix=bt709,format=yuv420p10le" -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc iec61966-2-1 -c:v libsvtav1 -crf 24 -preset 4 -frames:v 1 bg_1.avif
cwebp -q 85 -alpha_q 100 -m 6 -sharp_yuv -metadata none author.png -o author.webp
```

### Icons

Icons are inline SVG with class `icon`; they take their size from `font-size` and colour from `color`, like an icon font. Paste any SVG icon (e.g. from fontawesome.com) as `<svg class="icon" viewBox="…" aria-hidden="true"><path d="…"/></svg>`.

## Behaviour (js/main.js)

| Hook | What it does |
|---|---|
| `data-slider` | Hero slider |
| `data-parallax` | Element drifts at 70% of the scroll distance (on the hero's second slide) |
| `data-nav` | Navbar becomes fixed after 150px of scrolling, slides in after 350px, slides out when scrolling back up |
| `data-nav-toggle="#id"` | Mobile menu button; animates the target open/closed |
| `.reveal` | Fades the element up when it scrolls into view (staggered by 50ms) |
| `data-counters` / `data-count` | Counts numbers up over 7s when the section scrolls into view |
| `data-year` | Filled with the current year |
