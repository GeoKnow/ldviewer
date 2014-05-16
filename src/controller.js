angular.module('ldv.controller', ['ldv.services.UrlService', 'ldv.ui.survey'])
.controller('MetaCtrl', ['$rootScope', '$scope', '$routeParams', '$filter', '$timeout', "$http", '$compile', '$location', 'UrlService', function ($rootScope, $scope, $routeParams, $filter, $timeout, $http, $compile, $location, UrlService) {

	LDViewer.configure(LDViewer.configuration);

	LDViewer.doConfigure();

	LDViewer.about = function(about) {
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

	LDViewer.about({uri: resource});

	LDViewer.http = $http;
	delete $http.defaults.headers.common['X-Requested-With'];
	
	LDViewer.compile = $compile;
	
	$scope.loadFail = function() {
		LDViewer.addNotification('Loading failed.', 10000);
	};
	
	$scope.noInfo = function() {
		LDViewer.addNotification('No information about this resource available.', 10000);
	};
	
	LDViewer.preprocess_triple_url = function(url) {
		return UrlService.makeUrl(url).uri;
		/*if (url.slice(0, $scope.localgraph.length) == $scope.localgraph) {
			url = $scope.localprefix + url.slice($scope.localgraph.length, url.length);
		}
		return url;*/
	};
	
}]);