var dbpv = angular.module('ldv', ['ldv.services', 'ldv.controller', 'ldv.table', 'ldv.ui', 'ldv.pretty']);

var LDViewer = {};

dbpv.configure = function(confun) {
	dbpv.customConfigFunction = confun;
};

dbpv.doConfigure = function() {
	dbpv.customConfigFunction();
};

dbpv.config(function($routeProvider, $locationProvider) {
	//$locationProvider.html5Mode(true);
	$routeProvider
		.when('/search/:q', {templateUrl: '/tpl/search.html', controller: 'SearchCtrl'})
		.when('/resource/:page', {redirectTo: function(params, a, search) {return "/page/"+params.page;}})
		.when('/:a/:b', {templateUrl: '/tpl/entity.html', controller: 'MetaCtrl'})
		.when('/:a/:b/:c', {templateUrl: '/tpl/entity.html', controller: 'MetaCtrl'})
	//	.when('/:a//:b/:c/:d', {templateUrl: '/tpl/entity.html', controller: 'MetaCtrl'})
		.when('/:a/:b/:c/:d/:e', {templateUrl: '/tpl/entity.html', controller: 'MetaCtrl'})
		.otherwise({redirectTo: '/resource/404'});
});
//*/

dbpv.run(function($rootScope) {
	$rootScope.$watch('localgraph', function(lg) {
		$rootScope.endpointgraph = [lg];
	});
	
	dbpv.setConfig = function(config, value) {
		$rootScope[config] = value;
	};

	dbpv.getConfig = function(config) {
		return $rootScope[config];
	};
	$rootScope.iconpath = "/css/200px-dbpedia.png";
	


	$rootScope.loadFailed = function(msg) {
		$rootScope.failMessage = msg;
	};
	
	$rootScope.$watch("failMessage", function(msg) {
		if (msg && msg.length>1)
			dbpv.addNotification(msg, 10000);
	});
	
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

