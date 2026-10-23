(function () {

	"use strict";

	var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
	var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };


	// Hero slider: loops through slides, autoplays, pauses on hover, swipeable on touch
	var slider = function (root) {
		var DELAY = 5000, SPEED = 1000, SWIPE_SPEED = 250;
		var slides = $$(':scope > *', root);
		var count = slides.length;
		if (count < 2) return;

		var outer = document.createElement('div');
		var stage = document.createElement('div');
		outer.className = 'hero-slider__viewport';
		stage.className = 'hero-slider__track';
		outer.appendChild(stage);

		var wrap = function (el, isClone) {
			var item = document.createElement('div');
			item.className = 'hero-slider__item' + (isClone ? ' is-clone' : '');
			item.appendChild(isClone ? el.cloneNode(true) : el);
			return item;
		};
		// clones on both sides make the loop seamless in either direction
		slides.forEach(function (s) { stage.appendChild(wrap(s, true)); });
		slides.forEach(function (s) { stage.appendChild(wrap(s, false)); });
		slides.forEach(function (s) { stage.appendChild(wrap(s, true)); });
		root.appendChild(outer);

		// one dot per slide
		var dotsWrap = document.createElement('div');
		dotsWrap.className = 'hero-slider__dots';
		var dots = slides.map(function (s, i) {
			var dot = document.createElement('button');
			dot.className = 'hero-slider__dot';
			dot.type = 'button';
			dot.setAttribute('aria-label', 'Show slide ' + (i + 1));
			dot.addEventListener('click', function () {
				// take the shortest way round the loop
				var d = i - (index % count);
				if (d > count / 2) d -= count; else if (d < -count / 2) d += count;
				go(d, SWIPE_SPEED);
			});
			dotsWrap.appendChild(dot);
			return dot;
		});
		root.appendChild(dotsWrap);

		var items = $$('.hero-slider__item', stage);
		var index = count, width = 0, timer = null, hovered = false;

		var move = function (speed) {
			stage.style.transition = speed ? (speed / 1000) + 's' : '0s';
			stage.style.transform = 'translate3d(' + (-index * width) + 'px, 0px, 0px)';
			items.forEach(function (it, i) { it.classList.toggle('is-active', i === index); });
			dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === ((index % count) + count) % count); });
		};
		var layout = function () {
			width = root.clientWidth;
			stage.style.width = (items.length * width) + 'px';
			items.forEach(function (it) { it.style.width = width + 'px'; });
			move(0);
		};
		var go = function (step, speed) {
			index += step;
			move(speed);
		};
		// once a transition lands on a clone, jump to the matching real slide
		stage.addEventListener('transitionend', function (e) {
			if (e.target !== stage) return;
			if (index >= 2 * count) { index -= count; move(0); }
			else if (index < count) { index += count; move(0); }
		});

		var play = function () {
			clearTimeout(timer);
			timer = setTimeout(function () {
				if (!hovered && !document.hidden) go(1, SPEED);
				play();
			}, DELAY);
		};
		root.addEventListener('mouseenter', function () { hovered = true; clearTimeout(timer); });
		root.addEventListener('mouseleave', function () { hovered = false; play(); });

		// touch swipe
		var startX = null, startY = null, dx = 0, dragging = false;
		stage.addEventListener('touchstart', function (e) {
			startX = e.touches[0].clientX; startY = e.touches[0].clientY; dx = 0; dragging = false;
		}, { passive: true });
		stage.addEventListener('touchmove', function (e) {
			if (startX === null) return;
			var mx = e.touches[0].clientX - startX, my = e.touches[0].clientY - startY;
			if (!dragging && Math.abs(mx) > 3 && Math.abs(mx) > Math.abs(my)) { dragging = true; clearTimeout(timer); }
			if (!dragging) return;
			dx = mx;
			stage.style.transition = '0s';
			stage.style.transform = 'translate3d(' + (-index * width + dx) + 'px, 0px, 0px)';
		}, { passive: true });
		stage.addEventListener('touchend', function () {
			if (dragging) {
				go(Math.abs(dx) > 30 ? (dx < 0 ? 1 : -1) : 0, SWIPE_SPEED);
				play();
			}
			startX = null; dragging = false;
		});

		window.addEventListener('resize', layout);
		layout();
		play();

		// test/screenshot hook: stop autoplay and show the first slide
		window.__siteFreeze = function () { clearTimeout(timer); timer = null; index = count; move(0); play = function () {}; };
	};
	$$('[data-slider]').forEach(slider);


	// Parallax: hero text drifts at 70% of the scroll distance
	var parallax = function () {
		var els = $$('[data-parallax]');
		var update = function () {
			els.forEach(function (el) {
				var top = el.parentNode.getBoundingClientRect().top;
				el.style.transform = 'translateY(' + (-top * 0.7) + 'px)';
			});
		};
		var queued = false;
		// wait a frame so layout changes from other scroll handlers (navbar) are applied first
		var schedule = function () {
			if (queued) return;
			queued = true;
			requestAnimationFrame(function () { queued = false; update(); });
		};
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);
		window.addEventListener('transitionend', schedule); // navbar slide-in shifts the layout without scrolling
		schedule();
	};
	parallax();


	// Mobile menu: animated collapse
	var menu = function () {
		var toggle = $('[data-nav-toggle]');
		var nav = toggle && $(toggle.getAttribute('data-nav-toggle'));
		if (!nav) return;
		var busy = false;

		toggle.addEventListener('click', function (event) {
			event.preventDefault();
			if (busy) return;
			var open = nav.classList.contains('is-open');
			toggle.setAttribute('aria-expanded', String(!open));
			busy = true;

			if (open) {
				nav.style.height = nav.getBoundingClientRect().height + 'px';
				nav.offsetHeight; // force reflow so the height transition starts from the current height
				nav.classList.add('is-animating');
				nav.classList.remove('is-open');
				nav.style.height = '';
			} else {
				nav.classList.add('is-animating');
				nav.style.height = '0px';
				nav.offsetHeight;
				nav.style.height = nav.scrollHeight + 'px';
			}

			var done = function () {
				nav.classList.remove('is-animating');
				if (!open) nav.classList.add('is-open');
				nav.style.height = '';
				busy = false;
			};
			var duration = parseFloat(getComputedStyle(nav).transitionDuration) * 1000;
			setTimeout(done, duration || 0);
		});
	};
	menu();


	// Navbar: becomes fixed after 150px, slides in after 350px, slides out when scrolling back up
	var navbar = function () {
		var bar = $('[data-nav]');
		if (!bar) return;
		var onScroll = function () {
			var st = window.pageYOffset, c = bar.classList;
			if (st > 150) c.add('is-sticky');
			if (st < 150 && c.contains('is-sticky')) c.remove('is-sticky', 'is-leaving');
			if (st > 350) c.add('is-visible');
			if (st < 350 && c.contains('is-visible')) { c.remove('is-visible'); c.add('is-leaving'); }
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();
	};
	navbar();


	// Fire callback once when an element's top passes 95% of the viewport height
	var whenVisible = function (els, callback) {
		var pending = els.slice();
		var check = function () {
			var line = window.innerHeight * 0.95;
			pending = pending.filter(function (el) {
				if (el.getBoundingClientRect().top <= line) { callback(el); return false; }
				return true;
			});
		};
		window.addEventListener('scroll', check, { passive: true });
		window.addEventListener('resize', check);
		check();
	};


	// Counters: count up from 0 to data-count over 7s
	var counters = function () {
		var DURATION = 7000;
		var format = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
		var run = function (el) {
			var target = parseInt(el.getAttribute('data-count'), 10), start = null;
			var step = function (t) {
				if (start === null) start = t;
				var p = Math.min((t - start) / DURATION, 1);
				el.textContent = format(Math.floor(target * p));
				if (p < 1) requestAnimationFrame(step);
			};
			requestAnimationFrame(step);
		};
		$$('[data-counters]').forEach(function (section) {
			whenVisible([section], function () { $$('[data-count]', section).forEach(run); });
		});
	};
	counters();


	// Reveal: fade elements up as they scroll into view, staggered by 50ms
	var reveal = function () {
		var queue = [];
		whenVisible($$('.reveal'), function (el) {
			queue.push(el);
			setTimeout(function () {
				queue.forEach(function (el, k) {
					setTimeout(function () { el.classList.add('is-revealed'); }, k * 50);
				});
				queue = [];
			}, 100);
		});
	};
	reveal();


	// Footer year
	$$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

})();
