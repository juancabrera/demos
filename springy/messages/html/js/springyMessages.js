function springyMessages() {

	var self = this, 
		$b								= $("body"), 
		$messagesContainer				= $("#messages"), 
		$messages						= $("#messages .message"), 
		messagesLength					= $messages.length, 
		scrollY 						= 0, 
		lastScrollY 					= scrollY, 
		acceleration					= Array(), 
		velocity						= Array(), 
		inMotion						= Array(), 
		newTop 							= Array(), 
		messagesNewPositions			= Array(), 
		messagesPositions				= Array(), 
		messagesPositionsLeft			= Array(), 
		animating						= false, 
		frameRate						= 1 / 60,
		options 						= {
			stiffness: 130,
			stiffness2: 130,
			friction: 25,
			threshold: 0.03
		}
	;

	this.init = function() {
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

		$.each($messages.get().reverse(), function(i, v) {
			messagesPositions[i] = $(v).position().top;
			messagesPositionsLeft[i] = $(v).position().left;
			messagesNewPositions[i] = messagesPositions[i];
			newTop[i] = messagesPositions[i];
			inMotion[i] = true;
			acceleration[i] = 0;
			velocity[i] = 0;
		});

		window.addEventListener('scroll', self.onScrolling, false);
	}

	this.onScrolling = function(e) {
		lastScrollY = scrollY;
		scrollY = window.scrollY;

		if (!animating) {
			$b.addClass("no-pointers-events");
			$b.css({"height": $messagesContainer.outerHeight()});
			$messagesContainer.css({"height": $messagesContainer.outerHeight()});
			$.each($messages.get().reverse(), function(i, v) {
				var $thisMessage = $(v), 
					topCell = messagesNewPositions[i], 
					leftCell = messagesPositionsLeft[i], 
					widthCell = $thisMessage.outerWidth(), 
					heightCell = $thisMessage.outerHeight() 
				; 

				$thisMessage.css({"top": topCell + "px", "left": leftCell + "px", "width": widthCell + "px", "height": heightCell + "px", "position": "fixed"});	
				inMotion[i] = true;
			});

			animating = true;
			$messagesContainer.addClass("fixed");
			requestAnimFrame(self.stepScrolling);
		}
	}

	this.stepScrolling = function() {
		$.each($messages.get().reverse(), function(i, v) {
			var $thisMessage = $(v), 
				thisCellTop = parseInt($thisMessage.css("top")), 
				thisCellHeight = $thisMessage.outerHeight()
			;

			if (inMotion[i]) {
				acceleration[i] = (options.stiffness + (i * 5)) * ((messagesPositions[i] - scrollY) - thisCellTop) - options.friction * velocity[i];
				velocity[i] += acceleration[i] * frameRate;
				newTop[i] += velocity[i] * frameRate;
				inMotion[i] = Math.abs(acceleration[i]) >= options.threshold || Math.abs(velocity[i]) >= options.threshold;
				$thisMessage.css({top: newTop[i]});
				messagesNewPositions[i] = newTop[i];
			} else {
				self.completeScrolling();
			}
		});
		if (animating) requestAnimFrame(self.stepScrolling);
	}

	this.completeScrolling = function() {
		animating = false;
		cancelAnimationFrame(self.stepScrolling);
		$b.removeClass("no-pointers-events");

		window.setTimeout(function() {
			$.each($messages.get().reverse(), function(i, v) {
				var $thisMessage = $(v);
				$thisMessage.css({
					"top": "auto", 
					"left": "auto", 
					"position": "relative"
				});
				acceleration[i] = 0;
				velocity[i] = 0;
				inMotion[i] = false;
			});
			$messagesContainer.removeClass("fixed");
		}, 0);
	}
}

var Messages;
$(document).ready(function() {
	Messages = new springyMessages();
	Messages.init();
});
