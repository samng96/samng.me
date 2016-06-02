/*
	Spectral by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel
		.breakpoints({
			xlarge:	'(max-width: 1680px)',
			large:	'(max-width: 1280px)',
			medium:	'(max-width: 980px)',
			small:	'(max-width: 736px)',
			xsmall:	'(max-width: 480px)'
		});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$wrapper = $('#page-wrapper'),
			$banner = $('#banner'),
			$header = $('#header');

        var selected = null;
		
		var $passwords = $('.passwordPrompt');
		
		function imageUrl(urlParts, query) {
			var baseUrl = window.albumInfo.baseUrl;
			
			urlParts.unshift(baseUrl)

			return urlParts.join('/') + query;			
		}
		
		var $photosHolder = $('.albumPhotos');
		
		function renderImage(image) {
			
			var $image = $('<a class="thumb" data-lightbox="album" />')
				.attr('href', imageUrl(['photos', image.box], '?access=' + image.hash))
				.append($('<img />').attr('src', imageUrl(['photos', image.thumb], '?access=' + image.hash)));
				
			var $download = $('<a class="icon fa-cloud-download"></a>')
				.attr('href', imageUrl(['photos', image.url], '?access=' + image.hash));
			
			var $box = $('<li class="photoBox links" />')
				.append($('<span class="wtf" />'))
				.append($image)
				.append($download);
				
			$photosHolder.append($box);
		}

		function loadPhotos(password) {
			
			$.ajax(imageUrl([], "?password=" + password))
				.done(function(albumObject) {
					$.ajax(imageUrl(['photos'], '?access=' + albumObject.access))
						.done(function(photos) {
							photos.forEach(renderImage);
						});
				})
				.fail(function(res) {
					if(res.status == 401) {
						$passwords.show()
							.siblings('input').val('');
						
						if(typeof(password) !== "undefined") {
							$passwords.find('.passwordError').show()
						}
					}
					else {
						console.log("error loading photos", res);
					}
				});
		}
		
		if(window.albumInfo && window.albumInfo.baseUrl) {
			var albumInfo = window.albumInfo;
			
			$('#viewAlbum').click(function(event) {
				event.preventDefault();
				event.stopPropagation();
				$passwords.trigger('tryPassword');
			});
				
			$('#albumPassword').keypress(function(evt){
				if(evt.which === 13) {
					$passwords.trigger('tryPassword');
				}
			});
				
			$passwords.bind('tryPassword', function(evt) { 
				$(this).hide();
				var password = $('#albumPassword').val();
				loadPhotos(password);
			});
			
			loadPhotos();
		}

        function postsListsForNode(archiveNavNode) {
            return $(archiveNavNode).parent().siblings('div');
        }

        $('.archive-nav')
		.click(function(event) {
          if(selected !== null && selected !== this) {
            postsListsForNode(selected).hide();
            selected = this;
            postsListsForNode(selected).show();
          }
          else if (selected !== null && selected === this){
            postsListsForNode(selected).hide();
			
            selected = null;
          }
          else {
            selected = this;
            postsListsForNode(this).show();
          }

            event.preventDefault();
            event.stopPropagation();

            return false;
        });

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Mobile?
			if (skel.vars.mobile)
				$body.addClass('is-mobile');
			else
				skel
					.on('-medium !medium', function() {
						$body.removeClass('is-mobile');
					})
					.on('+medium', function() {
						$body.addClass('is-mobile');
					});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly')
				.scrolly({
					speed: 1500,
					offset: $header.outerHeight()
				});

		// Menu.
			$('#menu')
				.append('<a href="#menu" class="close"></a>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-menu-visible'
				});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() { $window.trigger('scroll'); });

				$banner.scrollex({
					bottom:		$header.outerHeight() + 1,
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			}

	});

})(jQuery);
