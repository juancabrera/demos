require(["jquery", "domReady", "core"], function($, domReady, core) {
	domReady(function () {
		console.log("DOM READY");

		var Core = new core();
		Core.init();
		Core.hideLoader();
		Core.fancyFirstLoad(1200);
	});
});