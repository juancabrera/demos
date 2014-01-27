define(["jquery"], function($) {
	var core							= function() {}, 
		$w 								= $(window), 
		$b								= $("body"), 
		$loader 						= $("#loader"), 
		$boxItems 						= $("#box .i"), 
		$box2 							= $("#box2"), 
		scrollY 						= 0, 
		lastScrollY 					= scrollY, 
		acceleration					= Array(), 
		velocity						= Array(0, 0, 0, 0, 0, 0), 
		inMotion						= Array(false, false, false, false, false, false), 
		frameRate						= 1 / 60,
		newTop 							= Array(50, 90, 130, 170, 210, 250), 
		animating						= false, 
		options 						= {
			stiffness: 100,
			stiffness2: 100,
			friction: 20,
			threshold: 0.03
		}
	;

	core.prototype.init = function() {
		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
		})();

		window.cancelRequestAnimFrame = ( function() {
			return window.cancelAnimationFrame          ||
			window.webkitCancelRequestAnimationFrame    ||
			window.mozCancelRequestAnimationFrame       ||
			window.oCancelRequestAnimationFrame     	||
			window.msCancelRequestAnimationFrame        ||
			clearTimeout
		} )();

		$b.css({height: $w.height() * 2});
		window.addEventListener('scroll', core.onScrolling, false);
	}

	core.onScrolling = function(e) {
		lastScrollY = scrollY;
		scrollY = window.scrollY;

		for (var i = 0; i <= 5; i++) inMotion[i] = true;

		if (!animating) {
			animating = true;
			requestAnimFrame(core.stepScrolling);			
		}
	}

	core.stepScrolling = function() {
		$box2.css({top: 50 + scrollY});

		$.each($boxItems, function(i, v) {
			var $thisItem = $(v);

			if (inMotion[i]) {
				if (scrollY - lastScrollY > 0) {
					acceleration[i] = (options.stiffness + (i * 5)) * ((scrollY + 50)  + (i * 40) - parseInt($thisItem.css("top"))) - options.friction * velocity[i];
				} else {
					acceleration[i] = (options.stiffness - (i * 5)) * ((scrollY + 50) + (i * 40) - parseInt($thisItem.css("top"))) - options.friction * velocity[i];
				}
				velocity[i] += acceleration[i] * frameRate;
				newTop[i] += velocity[i] * frameRate;
				inMotion[i] = Math.abs(acceleration[i]) >= options.threshold || Math.abs(velocity[i]) >= options.threshold;

				$thisItem.css({top: newTop[i]});
			} else {
				core.completeScrolling();
			}
		});
		if (animating) requestAnimFrame(core.stepScrolling);
	}

	core.completeScrolling = function() {
		for (var i = 0; i <= 5; i++) {
			acceleration[i] = 0;
			velocity[i] = 0;
			inMotion[i] = false;
		}
		animating = false;
		cancelAnimationFrame(core.stepScrolling);
	}

	return core;
});