angular.module('ldv.controller', ['ldv.services.UrlService'])
.controller('MetaCtrl', ['$rootScope', '$scope', '$routeParams', '$filter', '$timeout', "$http", '$compile', '$location', 'UrlService', function ($rootScope, $scope, $routeParams, $filter, $timeout, $http, $compile, $location, UrlService) {

	dbpv.configure(LDViewer.configuration);

	dbpv.doConfigure();

	dbpv.about = function(about) {
		if (about === undefined) {
			return $scope.about;
		} else {
			$rootScope.about = about;
		}
	}
	
	if ($routeParams.a == "page") {
		$routeParams.a = "resource";
	}
	
	var resource = UrlService.processResource($routeParams);

	dbpv.about({uri: resource});

	dbpv.http = $http;
	delete $http.defaults.headers.common['X-Requested-With'];
	
	dbpv.compile = $compile;
	
	$scope.loadFail = function() {
		dbpv.addNotification('Loading failed.', 10000);
	};
	
	$scope.noInfo = function() {
		dbpv.addNotification('No information about this resource available.', 10000);
	};
	
	dbpv.preprocess_triple_url = function(url) {
		return UrlService.makeUrl(url).uri;
		/*if (url.slice(0, $scope.localgraph.length) == $scope.localgraph) {
			url = $scope.localprefix + url.slice($scope.localgraph.length, url.length);
		}
		return url;*/
	};
	
}]);