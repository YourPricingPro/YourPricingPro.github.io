(function ($) {

	"use strict";

	// Scrollax
	$.Scrollax();

	// Burger Menu
	var burgerMenu = function () {

		$('body').on('click', '.js-fh5co-nav-toggle', function (event) {

			event.preventDefault();

			if ($('#nav').is(':visible')) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}

		});

	};
	burgerMenu();


	var carousel = function () {
		$('.home-slider').owlCarousel({
			loop: true,
			margin: 0,
			autoplay: true,
			autoplaySpeed: 1000,
			nav: false,
			autoplayHoverPause: true,
			mouseDrag: false,
			items: 1
		});
	};
	carousel();


	// scroll
	var scrollWindow = function () {
		$(window).scroll(function () {
			var $w = $(this),
				st = $w.scrollTop(),
				navbar = $('.ftco_navbar');

			if (st > 150) {
				if (!navbar.hasClass('scrolled')) {
					navbar.addClass('scrolled');
				}
			}
			if (st < 150) {
				if (navbar.hasClass('scrolled')) {
					navbar.removeClass('scrolled sleep');
				}
			}
			if (st > 350) {
				if (!navbar.hasClass('awake')) {
					navbar.addClass('awake');
				}
			}
			if (st < 350) {
				if (navbar.hasClass('awake')) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
			}
		});
	};
	scrollWindow();


	var counter = function () {

		$('#section-counter').waypoint(function (direction) {

			if (direction === 'down' && !$(this.element).hasClass('animated')) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number').each(function () {
					var $this = $(this),
						num = $this.data('number');
					$this.animateNumber(
						{
							number: num,
							numberStep: comma_separator_number_step
						}, 7000
					);
				});

			}

		}, { offset: '95%' });

	}
	counter();


	var contentWayPoint = function () {
		$('.animate').waypoint(function (direction) {

			if (direction === 'down' && !$(this.element).hasClass('animated')) {

				$(this.element).addClass('item-animate');
				setTimeout(function () {

					$('body .animate.item-animate').each(function (k) {
						var el = $(this);
						setTimeout(function () {
							el.addClass('fadeInUp animated');
							el.removeClass('item-animate');
						}, k * 50);
					});

				}, 100);

			}

		}, { offset: '95%' });
	};
	contentWayPoint();

})(jQuery);
