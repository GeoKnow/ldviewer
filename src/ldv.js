var ldv = angular.module('ldv', ['ngRoute', 'ldv.services', 'ldv.controller', 'ldv.table', 'ldv.ui', 'ldv.pretty']);

var LDViewer = {};

LDViewer.configure = function(confun) {
	LDViewer.customConfigFunction = confun;
};

LDViewer.doConfigure = function() {
	LDViewer.customConfigFunction();
};

ldv.config(function($routeProvider, $locationProvider) {
	//$locationProvider.html5Mode(true);
	$routeProvider
		.when('/test', {templateUrl:'tpl/test.html'})
		.when('/search/:q', {templateUrl: '/tpl/search.html', controller: 'SearchCtrl'})
		.when('/resource/:page', {redirectTo: function(params, a, search) {return "/page/"+params.page;}})
		.when('/:a/:b', {templateUrl: '/tpl/entity.html', controller: 'MetaCtrl'})
		.when('/:a/:b/:c', {templateUrl: '/tpl/entity.html', controller: 'MetaCtrl'})
	//	.when('/:a//:b/:c/:d', {templateUrl: '/tpl/entity.html', controller: 'MetaCtrl'})
		.when('/:a/:b/:c/:d/:e', {templateUrl: '/tpl/entity.html', controller: 'MetaCtrl'})
		.otherwise({redirectTo: '/resource/404'});
});
//*/

ldv.run(function($rootScope) {
	$rootScope.$watch('localgraph', function(lg) {
		$rootScope.endpointgraph = [lg];
	});
	
	LDViewer.setConfig = function(config, value) {
		$rootScope[config] = value;
	};

	LDViewer.getConfig = function(config) {
		return $rootScope[config];
	};
	$rootScope.iconpath = "/css/200px-dbpedia.png";
	


	$rootScope.loadFailed = function(msg) {
		$rootScope.failMessage = msg;
	};
	
	$rootScope.$watch("failMessage", function(msg) {
		if (msg && msg.length>1)
			LDViewer.addNotification(msg, 10000);
	});
	
	LDViewer.configure(LDViewer.configuration);
	LDViewer.doConfigure();
	
		// LOAD SETTINGS FROM COOKIES
	var cookies = $.cookie();
	for (var key in cookies) {
		var settingsprefix = "dbpv_setting_";
		if (key.slice(0, settingsprefix.length) == settingsprefix) {
			var val = cookies[key];
			if (val == "true") val = true;
			if (val == "false") val = false;
			$rootScope[key.slice(settingsprefix.length, key.length)] = val;
		}
	}
});

