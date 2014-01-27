requirejs.config({
	baseUrl: 'js',
	paths: {
		'jquery': "jquery-2.0.3.min"
	}, 
	waitSeconds: 20
});

require(['main'], function () {
});