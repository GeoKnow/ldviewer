
angular.module('ldv.ui.lookup', ['ldv.services.search', 'ui.bootstrap', 'ldv.templates.ui'])
.directive('dbpvLookup', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace: 	true,
		controller:	'DbpvLookupCtrl',
		scope:		{
						localprefix:	"=",
						lookupgraph:	"=",
						lookupendpoint:	"="
					},
		templateUrl:	'ui/lookup/lookup.html'
	};
})

	.controller('DbpvLookupCtrl', ['$scope', '$http', '$timeout', 'Search', '$templateCache', function($scope, $http, $timeout, Search, $templateCache) {
		
		$templateCache.put("tpl/typeahead-custom.html", '<a><span bind-html-unsafe="match.label|typeaheadHighlight:query"></span><span class="typeahead-url"> ({{match.model.url}})</span></a>');
	
		var timer = false;
		var delay = 500;

		$scope.results = [];
		
		$scope.$watch('querie', function(querie) {
			if (querie === undefined || querie == "") {
				$scope.results = [];
			}else{
				if (querie.url !== undefined) {
					if (querie.url.substr(0, $scope.lookupgraph.length) == $scope.lookupgraph) {
						querie.url = querie.url.substr($scope.lookupgraph.length);
						if ($scope.localprefix !== undefined && $scope.localprefix != "") {
							window.location = $scope.localprefix+querie.url;
						} else {
							window.location = querie.url;
						}
					}
				}
			}
		});

		$scope.lookup = function() {
			
			if ($scope.querie === undefined || $scope.querie == "") {
				$scope.results = [];
			}else{
				return Search.search($scope.querie, 10).then(function(results) {
					var res = [];
					for (var i = 0; i < results.length; i++) {
						var result = results[i];
						var r = {"type": "uri", "l_label": result['label'].literalLabel.lex, "url": result["uri"].uri};
						res.push(r);
					}
					console.log(res);
					return res;
				});
			//*/
			
			/*  delete $http.defaults.headers.common['X-Requested-With'];
				//alert("returning promise");
				return $http.get($scope.lookupendpoint+"/PrefixSearch?MaxHits=5&QueryString="+$scope.query).then(function(data) {
					var results = data.data["results"];
					var res = [];
					for (var i = 0; i<results.length ; i++) {
						var result = results[i];
						var r = {"type": "uri", "l_label": result['label'], "url": result['uri']};
						res.push(r);
				//		console.log(r.l_label);
					}
					return res;
				});//*/
			}
		};
	}])

;
