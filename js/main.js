/*
 * Your Pricing Pro — site behaviour (no dependencies)
 *
 * Each module finds its elements by a data- attribute or class in index.html:
 *   1. Helpers
 *   2. Hero slider        [data-slider]
 *   3. Mobile menu        [data-nav-toggle]
 *   4. Sticky navbar      [data-nav]
 *   5. Scroll trigger     whenVisible(), used by the counters and reveal
 *   6. Counters           [data-counters], [data-count]
 *   7. Shuffle            [data-shuffle]
 *   8. Reveal             .reveal
 *   9. Contact form       [data-contact], [data-contact-modal]
 *  10. Footer year        [data-year]
 */

(() => {

	'use strict';


	/* 1. Helpers --------------------------------------------------------- */

	// querySelector and querySelectorAll (as an array), within ctx or the whole document
	const $ = (sel, ctx = document) => ctx.querySelector(sel);
	const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


	/* 2. Hero slider ------------------------------------------------------
	 * Loops through the slides, autoplays, pauses on hover and can be swiped on touch screens.
	 * The track holds three copies of the slides (clones, originals, clones). When a move lands
	 * on a clone, the track jumps without animation to the matching original, so the loop is
	 * seamless in both directions. The clones are hidden from screen readers and the Tab key, and
	 * their titles are <p>s (they look the same), so the page keeps a single <h1>.
	 */

	const slider = (root) => {
		const DELAY = 5000; // ms between autoplay moves
		const SPEED = 1000; // ms an autoplay move takes
		const SWIPE_SPEED = 250; // ms a swipe or dot click move takes
		const SWIPE_MIN = 30; // px a swipe must travel to change the slide
		const DRAG_MIN = 3; // px a touch must move sideways before the track follows it

		const slides = $$(':scope > *', root);
		const count = slides.length;
		if (count < 2) return;

		// Build viewport > track > items, each item holding one slide
		const viewport = document.createElement('div');
		const track = document.createElement('div');
		viewport.className = 'hero-slider_viewport';
		track.className = 'hero-slider_track';
		viewport.appendChild(track);

		const wrap = (slide, isClone) => {
			const item = document.createElement('div');
			item.className = 'hero-slider_item';
			if (isClone) {
				slide = slide.cloneNode(true);
				item.setAttribute('aria-hidden', 'true');
				$$('a, button', slide).forEach((el) => { el.tabIndex = -1; });
				$$('h1', slide).forEach((h1) => {
					const p = document.createElement('p');
					p.className = h1.className;
					p.append(...h1.childNodes);
					h1.replaceWith(p);
				});
			}
			item.appendChild(slide);
			return item;
		};
		slides.forEach((slide) => track.appendChild(wrap(slide, true)));
		slides.forEach((slide) => track.appendChild(wrap(slide, false)));
		slides.forEach((slide) => track.appendChild(wrap(slide, true)));
		root.appendChild(viewport);

		const items = $$('.hero-slider_item', track);
		let index = count; // the item shown; starts on the first original
		let width = 0; // slide width in px, set by layout()
		let timer = null; // autoplay timeout
		let hovered = false;

		// The slide (0 … count - 1) that items[index] shows
		const current = () => ((index % count) + count) % count;

		// Shift the track to px over speed ms (0 = at once)
		const setOffset = (px, speed) => {
			track.style.transition = speed ? speed / 1000 + 's' : '0s';
			track.style.transform = `translate3d(${px}px, 0px, 0px)`;
		};

		// Show items[index] and mark it and its dot as active
		const move = (speed) => {
			setOffset(-index * width, speed);
			items.forEach((item, i) => item.classList.toggle('is-active', i === index));
			dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current()));
		};

		// Move by step slides: positive forward, negative back, 0 snaps back into place
		const go = (step, speed) => {
			index += step;
			move(speed);
		};

		// Go to slide i, the shortest way round the loop
		const goTo = (i) => {
			let step = i - (index % count);
			if (step > count / 2) step -= count;
			else if (step < -count / 2) step += count;
			go(step, SWIPE_SPEED);
		};

		// Size the track and items to the slider's width
		const layout = () => {
			width = root.clientWidth;
			track.style.width = items.length * width + 'px';
			items.forEach((item) => { item.style.width = width + 'px'; });
			move(0);
		};

		// One dot per slide
		const dotsWrap = document.createElement('div');
		dotsWrap.className = 'hero-slider_dots';
		const dots = slides.map((slide, i) => {
			const dot = document.createElement('button');
			dot.className = 'hero-slider_dot';
			dot.type = 'button';
			dot.setAttribute('aria-label', 'Show slide ' + (i + 1));
			dot.addEventListener('click', () => goTo(i));
			dotsWrap.appendChild(dot);
			return dot;
		});
		root.appendChild(dotsWrap);

		// Once a move lands on a clone, jump to the matching original
		track.addEventListener('transitionend', (e) => {
			if (e.target !== track) return; // ignore transitions inside the slides
			if (index >= 2 * count) {
				index -= count;
				move(0);
			} else if (index < count) {
				index += count;
				move(0);
			}
		});

		// Autoplay: move on every DELAY ms, except while hovered or while the tab is hidden
		const play = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				if (!hovered && !document.hidden) go(1, SPEED);
				play();
			}, DELAY);
		};
		root.addEventListener('mouseenter', () => {
			hovered = true;
			clearTimeout(timer);
		});
		root.addEventListener('mouseleave', () => {
			hovered = false;
			play();
		});

		// Touch swipe: the track follows the finger once the touch moves more sideways than up or down
		let startX = null;
		let startY = null;
		let dx = 0;
		let dragging = false;
		track.addEventListener('touchstart', (e) => {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			dx = 0;
			dragging = false;
		}, { passive: true });
		track.addEventListener('touchmove', (e) => {
			if (startX === null) return;
			const mx = e.touches[0].clientX - startX;
			const my = e.touches[0].clientY - startY;
			if (!dragging && Math.abs(mx) > DRAG_MIN && Math.abs(mx) > Math.abs(my)) {
				dragging = true;
				clearTimeout(timer);
			}
			if (!dragging) return;
			dx = mx;
			setOffset(-index * width + dx, 0);
		}, { passive: true });
		track.addEventListener('touchend', () => {
			if (dragging) {
				go(Math.abs(dx) > SWIPE_MIN ? (dx < 0 ? 1 : -1) : 0, SWIPE_SPEED);
				play();
			}
			startX = null;
			dragging = false;
		});

		window.addEventListener('resize', layout);
		layout();
		play();
	};
	$$('[data-slider]').forEach(slider);


	/* 3. Mobile menu ------------------------------------------------------
	 * The toggle button animates the menu (named by its aria-controls) open or closed. During the
	 * animation the menu has .is-animating and an inline height; afterwards .is-open keeps it open.
	 */

	const menu = () => {
		const toggle = $('[data-nav-toggle]');
		const nav = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
		if (!nav) return;
		let busy = false; // ignore clicks while the menu is animating

		toggle.addEventListener('click', () => {
			if (busy) return;
			const open = nav.classList.contains('is-open');
			toggle.setAttribute('aria-expanded', String(!open));
			busy = true;

			if (open) {
				// Close: pin the current height, then let it animate to the .is-animating height of 0
				nav.style.height = nav.getBoundingClientRect().height + 'px';
				nav.offsetHeight; // force a reflow so the transition starts from that height
				nav.classList.add('is-animating');
				nav.classList.remove('is-open');
				nav.style.height = '';
			} else {
				// Open: start at 0 and animate to the menu's full height
				nav.classList.add('is-animating');
				nav.style.height = '0px';
				nav.offsetHeight; // force a reflow so the transition starts from 0
				nav.style.height = nav.scrollHeight + 'px';
			}

			// When the transition is over, settle into the final state
			const duration = parseFloat(getComputedStyle(nav).transitionDuration) * 1000;
			setTimeout(() => {
				nav.classList.remove('is-animating');
				if (!open) nav.classList.add('is-open');
				nav.style.height = '';
				busy = false;
			}, duration || 0);
		});

		// Close the menu at once when one of its links is followed, so the page
		// doesn't shift under the smooth scroll to the section
		$$('a', nav).forEach((link) => {
			link.addEventListener('click', () => {
				if (!nav.classList.contains('is-open')) return;
				nav.classList.remove('is-open');
				toggle.setAttribute('aria-expanded', 'false');
			});
		});
	};
	menu();


	/* 4. Sticky navbar ----------------------------------------------------
	 * After STICK px of scrolling the bar becomes fixed, hidden above the viewport; after SHOW px
	 * it slides in, and it slides out again when the page is scrolled back above SHOW.
	 */

	const navbar = () => {
		const STICK = 150;
		const SHOW = 350;
		const bar = $('[data-nav]');
		if (!bar) return;
		const mobile = matchMedia('(max-width: 991.98px)'); // style.css keeps the bar in the page flow below lg

		// Fix or release the bar. On mobile the bar is part of the page flow: keep its space while
		// it is fixed, so the content doesn't jump up (and anchor links land below the bar)
		const stick = (on) => {
			document.body.style.paddingTop = on && mobile.matches ? bar.offsetHeight + 'px' : '';
			bar.classList.toggle('is-sticky', on);
			if (!on) bar.classList.remove('is-leaving');
		};

		const onScroll = () => {
			const y = window.scrollY;
			const state = bar.classList;
			if (y > STICK && !state.contains('is-sticky')) stick(true);
			if (y < STICK && state.contains('is-sticky')) stick(false);
			if (y > SHOW) state.add('is-visible');
			if (y < SHOW && state.contains('is-visible')) {
				state.remove('is-visible');
				state.add('is-leaving');
			}
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		// Re-measure after crossing the breakpoint (the bar is in the flow on mobile only). Not on
		// every resize: iOS Safari fires one whenever its toolbars grow or shrink during a scroll,
		// and releasing the bar for a moment there flashed it black
		mobile.addEventListener('change', () => {
			if (!bar.classList.contains('is-sticky')) return;
			stick(false);
			onScroll();
		});
		onScroll();
	};
	navbar();


	/* 5. Scroll trigger ---------------------------------------------------
	 * Calls callback(el) once for each element, as soon as its top is above 95% of the viewport
	 * height (straight away for elements that already are). Stops listening once all have fired.
	 */

	const whenVisible = (els, callback) => {
		let pending = els.slice();
		const check = () => {
			const line = window.innerHeight * 0.95;
			pending = pending.filter((el) => {
				if (el.getBoundingClientRect().top > line) return true;
				callback(el);
				return false;
			});
			if (pending.length) return;
			window.removeEventListener('scroll', check);
			window.removeEventListener('resize', check);
		};
		window.addEventListener('scroll', check, { passive: true });
		window.addEventListener('resize', check);
		check();
	};


	/* 6. Counters ---------------------------------------------------------
	 * Once a [data-counters] section scrolls into view, each [data-count] number in it
	 * counts up from 0 over DURATION ms.
	 */

	const counters = () => {
		const DURATION = 7000;
		const format = (n) => n.toLocaleString('en-US'); // 19478 → "19,478"

		const run = (el) => {
			const target = parseInt(el.dataset.count, 10);
			let start = null;
			const step = (time) => {
				if (start === null) start = time;
				const progress = Math.min((time - start) / DURATION, 1);
				el.textContent = format(Math.floor(target * progress));
				if (progress < 1) requestAnimationFrame(step);
			};
			requestAnimationFrame(step);
		};

		$$('[data-counters]').forEach((section) => {
			whenVisible([section], () => $$('[data-count]', section).forEach(run));
		});
	};
	counters();


	/* 7. Shuffle ----------------------------------------------------------
	 * Puts the children of each [data-shuffle] element in a random order on every page load
	 * (the client logos: style.css places them by position, so each lands in a different spot).
	 * Runs before reveal, so they also fade in in their new order.
	 */

	const shuffle = () => {
		$$('[data-shuffle]').forEach((list) => {
			const items = [...list.children];
			// Fisher–Yates: every order is equally likely
			for (let i = items.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[items[i], items[j]] = [items[j], items[i]];
			}
			list.append(...items);
		});
	};
	shuffle();


	/* 8. Reveal -----------------------------------------------------------
	 * .reveal elements fade up as they scroll into view (style.css animates .is-revealed).
	 * Elements that come into view together are revealed one after another, STAGGER ms apart.
	 */

	const reveal = () => {
		const BATCH = 100; // ms to collect the elements that come into view together
		const STAGGER = 50;
		let queue = [];
		// Every arrival schedules a flush BATCH ms later; a flush reveals everything queued so far
		whenVisible($$('.reveal'), (el) => {
			queue.push(el);
			setTimeout(() => {
				queue.forEach((queued, i) => {
					setTimeout(() => queued.classList.add('is-revealed'), i * STAGGER);
				});
				queue = [];
			}, BATCH);
		});
	};
	reveal();


	/* 9. Contact form -----------------------------------------------------
	 * The [data-contact] buttons open the form in a modal dialog (their mailto: links stay as
	 * the fallback without JavaScript). It posts to web3forms as JSON, so the visitor stays on
	 * the page, and shows a thank-you panel or an error message.
	 */

	const contactForm = () => {
		const modal = $('[data-contact-modal]');
		if (!modal || !modal.showModal) return;
		const form = $('[data-contact-form]', modal);
		const error = $('[data-contact-error]', modal);
		const done = $('[data-contact-done]', modal);
		const submit = $('[type=submit]', form);
		const label = submit.textContent;
		let busy = false; // ignore submits while one is being sent

		// Open the dialog, starting with an empty form after a sent message
		const openModal = () => {
			if (!done.hidden) {
				form.reset();
				form.hidden = false;
				done.hidden = true;
			}
			error.hidden = true;
			modal.showModal();
			modal.focus(); // showModal() would focus the close button and show its focus ring straight away
		};

		// Delegated, so it also catches the hero buttons on the slider's cloned slides
		document.addEventListener('click', (e) => {
			if (!e.target.closest('[data-contact]')) return;
			e.preventDefault();
			openModal();
		});

		// Close with the × and Close buttons, or a click on the backdrop. A click on the backdrop
		// lands on the dialog itself; drags that start inside the card are ignored.
		$$('[data-contact-close]', modal).forEach((btn) => {
			btn.addEventListener('click', () => modal.close());
		});
		let downOnBackdrop = false;
		modal.addEventListener('pointerdown', (e) => { downOnBackdrop = e.target === modal; });
		modal.addEventListener('click', (e) => {
			if (e.target === modal && downOnBackdrop) modal.close();
		});

		// Send the form
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			if (busy) return;
			busy = true;
			error.hidden = true;
			submit.disabled = true;
			submit.textContent = 'Sending…';

			try {
				const response = await fetch(form.action, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
					body: JSON.stringify(Object.fromEntries(new FormData(form))),
				});
				const json = await response.json();
				if (!response.ok || !json.success) throw new Error(json.message || json.error || response.status);
				form.hidden = true;
				done.hidden = false;
				$('h2', done).focus();
			} catch (err) {
				console.error('Contact form:', err);
				error.hidden = false; // the visitor's text stays in the form for another try
			} finally {
				busy = false;
				submit.disabled = false;
				submit.textContent = label;
			}
		});
	};
	contactForm();


	/* 10. Footer year ----------------------------------------------------- */

	$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

})();
