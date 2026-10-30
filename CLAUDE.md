# CLAUDE.md

Instructions for AI coding agents working on this repo. The README is the source of truth for the site's structure and conventions; it is imported here so it is always in context:

@README.md

## Ground rules

- **Don't change how the site looks, feels or behaves** unless the task asks for exactly that. A cleanup or refactor must leave every page pixel-identical, at every width, in light and dark mode.
- **Keep it plain**: hand-written HTML, CSS and JavaScript, no frameworks, no build step, no npm dependencies in the repo. `main.js` stays a classic script in an IIFE, not a module, so `index.html` still works when opened straight from disk.
- **Follow the conventions in the README** (class names, `is-` states, `data-` hooks, theme variables, range media queries, `px` units, semantic markup, image names). Match the surrounding code's style and comment density; tabs and LF line endings (`.editorconfig`).
- **Keep the docs in step with the code.** When a change affects anything the README describes (files, conventions, building blocks, behaviour hooks, release steps), update the README in the same commit. Keep the table of contents at the top of `style.css` and `main.js` current.

## Every change

- **Content** (services, facts, contact details) lives in four places: `index.html`, its JSON-LD block, `index.html.md` and `llms.txt`. Change them all together.
- **Menu and footer** are copied into every `.html` page (`index.html`, `404.html`, `impressum.html`, `privacy.html`, and any page added later). Any change to either goes into all of them in the same commit, and a new page gets the same menu and footer. The footer stays on one line at every width, and pages that can be shorter than the window have `class="page-fill"` on `<body>` (see "Footer" in the README).
- **Release steps**: when `style.css` or `main.js` changes, bump `?v=` in every `.html` page. When the page's content changes, set `<lastmod>` in `sitemap.xml`. A changed image gets a new file name, and every reference to it is updated.
- **Check in the built-in browser** before calling a change done: start the `site` preview (`.claude/launch.json`, port 8765) and go through "Checking a change" in the README. Report what you checked, and anything you couldn't.
- **Before removing CSS that looks unused**, check the README's "Rules that look unused but aren't". Compare screenshots before and after any change that touches painting, stacking or transforms.

## Git

- Work on `dev`. `master` is the live site: never commit or push to it directly, and never force-push.
- One logical change per commit, with a short imperative subject ("Rename images and licences, …") and a body when the reason isn't obvious.
- **Never name consulting clients** (the companies in the client-logo section) in commit messages or PR text. Say "client logos", not the company names.
- Commit, push and open PRs (`dev → master`) only when asked.
- `src/` (design sources and originals) and `.claude/` are local only and git-ignored; never add them.
