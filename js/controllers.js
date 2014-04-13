dbpv.controller('MetaCtrl', ['$rootScope', '$scope', '$routeParams', '$filter', '$timeout', "$http", '$compile', '$location', 'Entity', 'Preview', 'UrlService', function ($rootScope, $scope, $routeParams, $filter, $timeout, $http, $compile, $location, Entity, Preview, UrlService) {

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

	$rootScope.prefixes = {
		"http://dbpedia.org/resource/": "dbpedia",
		"http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdf",
		"http://www.w3.org/2000/01/rdf-schema#": "rdfs",
		"http://xmlns.com/foaf/0.1/": "foaf",
		"http://dbpedia.org/ontology/": "dbpedia-owl",
		"http://dbpedia.org/property/": "dbpprop",
		"http://dbpedia.org/resource/Category:": "category",
		"http://dbpedia.org/class/yago/": "yago",
		"http://www.w3.org/2001/XMLSchema#": "xsd",
		"http://linkedgeodata.org/ontology/": "lgdo",
		"http://linkedgeodata.org/meta/":	"lgd-meta",
		"http://linkedgeodata.org/geometry/":	"lgd-geometry",
		"http://linkedgeodata.org/triplify/":	"lgd-triplify",
		"http://linkedgeodata.org/":	"lgd"
	};

	dbpv.doConfigure();

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



dbpv.controller("SearchCtrl", ['$scope', function($scope) {
	$scope.results = []
}]);