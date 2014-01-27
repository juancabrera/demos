require(["jquery"], function($) {
	
	var core				= function() {}, 
		$w 					= $(window), 
		$loader 			= $("#loader"), 
		speedTransition 	= 800
	;

	core.prototype.init = function() {
	}

	core.hideLoader = function() {
		$loader.addClass("h");
	}

	core.showLoader = function() {
		
	}

	return core;
});