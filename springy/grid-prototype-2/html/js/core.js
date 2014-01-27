define(["jquery"], function($) {
	
	var core							= function() {}, 
		$w 								= $(window), 
		$b								= $("body"), 
		$loader 						= $("#loader"), 
		$mainContainer					= $("#mainContainer"), 
		$arrowThumb						= $("a.arrow"), 
		$header							= $("header"), 
		$leftNav						= $("nav.left"), 
		$rightNav						= $("nav.right"), 
		$superGrid						= $("#superGrid"), 
		$superGridCells					= $("#superGrid .gridCell"), 
		superGridLength					= $superGridCells.length, 
		speedTransition 				= 800, 
		heightHeader					= 80, 
		scrollY 						= 0, 
		lastScrollY 					= scrollY, 
		gridCellPositions				= Array()
		nroColums 						= 3, 
		acceleration					= Array(), 
		velocity						= Array(), 
		inMotion						= Array(), 
		frameRate						= 1 / 60,
		newTop 							= Array(), 
		animating						= false, 
		options 						= {
			stiffness: 70,
			stiffness2: 90,
			friction: 30 ,
			threshold: 0.03
		} 
	;


	core.prototype.init = function() {
		core.attachhandlers();

		Math.easeOutQuad = function (t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		}

		Math.easeOutExpo = function (t, b, c, d) {
			return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
		};

		Math.easeOutQuart = function (t, b, c, d) {
			t /= d;
			t--;
			return -c * (t*t*t*t - 1) + b;
		}

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

		$.each($superGridCells, function(i, v) {
			var $thisCell = $(v), 
				topCell = $thisCell.position().top, 
				leftCell = $thisCell.position().left
			; 
			gridCellPositions[i] = {"top":topCell, "left":leftCell};			
		});

		var x = 0;
		$.each($superGridCells, function(i, v) {
			var $thisCell = $(v);
			$thisCell.addClass("r" + Math.floor(x/nroColums));
			x++;
		});

		for (var x = 0; x < Math.ceil(superGridLength / nroColums); x++) {
			inMotion[x] = true;
			acceleration[x] = 0;
			velocity[x] = 0;
			newTop[x] = gridCellPositions[x * nroColums].top;
		}
	}

	core.prototype.hideLoader = function(callback) {
		$loader.addClass("h");
		window.setTimeout(function() {
			$loader.css({"display": "none"});
		}, speedTransition);
	}

	core.prototype.showLoader = function() {
	}

	core.prototype.fancyFirstLoad = function(ms) {
		window.setTimeout(function() {
			$mainContainer.removeClass("h");			
		}, ms);
	}

	core.attachhandlers = function() {
		window.addEventListener('scroll', core.onScrolling, false);
	}

	core.onScrolling = function(e) {
		lastScrollY = scrollY;
		scrollY = window.scrollY;

		for (var i = 0; i < Math.ceil(superGridLength / nroColums); i++) {
			inMotion[i] = true;
		}

		if (!animating) {
			$b.addClass("no-pointers-events");
			$header.addClass("hide");
			$superGrid.addClass("no-border");

			$b.css({"height": $superGrid.height()});
			$.each($superGridCells.get().reverse(), function(i, v) {
				var $thisCell = $(v), 
					topCell = $thisCell.position().top , 
					leftCell = $thisCell.position().left
				; 

				$thisCell.css({
					"top": topCell + "px", 
					"left": leftCell + "px", 
					"position": "fixed"
				});				
			});
			$superGrid.addClass("fixed");

			animating = true;
			requestAnimFrame(core.stepScrolling);			
		}
	}

	core.stepScrolling = function() {
		// console.log("\n");
		for (var i = 0; i < Math.ceil(superGridLength / nroColums); i++) {
			var $thisItem = $(".gridCell.r" + i), 
				thisCellTop = parseInt($(".gridCell.r" + i + ":first").css("top")), 
				thisCellHeight = parseInt($(".gridCell.r" + i + ":first").css("height"))
			;
			
			if (inMotion[i]) {
				if (scrollY - lastScrollY > 0) {
					acceleration[i] = (options.stiffness + (i * 5)) * ((((i * thisCellHeight) + heightHeader) - scrollY) - thisCellTop) - options.friction * velocity[i];
				} else {
					acceleration[i] = (options.stiffness2 - (i * 5)) * ((((i * thisCellHeight) + heightHeader) - scrollY) - thisCellTop) - options.friction * velocity[i];
				}

				velocity[i] += acceleration[i] * frameRate;
				newTop[i] += velocity[i] * frameRate;
				inMotion[i] = Math.abs(acceleration[i]) >= options.threshold || Math.abs(velocity[i]) >= options.threshold;
				$thisItem.css({top: newTop[i]});
			} else {
				core.completeScrolling();
			}
		}

		if (animating) requestAnimFrame(core.stepScrolling);
	}

	core.completeScrolling = function() {
		for (var i = 0; i < Math.ceil(superGridLength / nroColums); i++) {
			acceleration[i] = 0;
			velocity[i] = 0;
			inMotion[i] = false;
		}
		animating = false;
		cancelAnimationFrame(core.stepScrolling);

		$b.removeClass("no-pointers-events");
		$header.removeClass("hide");
		$superGrid.removeClass("no-border");

		window.setTimeout(function() {
			$superGrid.removeClass("fixed");
			$.each($superGridCells.get().reverse(), function(i, v) {
				var $thisCell = $(v), 
					topCell = $thisCell.position().top, 
					leftCell = $thisCell.position().left
				; 

				$thisCell.css({
					"top": "auto", 
					"left": "auto", 
					"position": "relative"
				});
			});
		}, 0);
	}

	return core;
});