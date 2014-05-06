
angular.module('ldv.pretty.types', ['ldv.preview', 'ldv.filters', 'ldv.services.preview', 'ldv.services.UrlService'])
.directive('prettyTypes', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						types:			"=",
						primarylang:	"=",
						fallbacklang:	"=",
						owlgraph:		"=",
						owlendpoint:	"="
					},
		template:	'<div id="dbpvptypes" ng-show="types.length>0"><span class="dbpvptype" ng-repeat="type in types"><span pretty-type node="type" primarylang="primarylang" fallbacklang="fallbacklang" owlgraph="owlgraph" owlendpoint="owlendpoint"></span><span class="comma">, </span></span></div>',
		
		controller:	'PrettyTypesCtrl'
	};
})

	.controller('PrettyTypesCtrl', ['$scope', function($scope) {
		$scope.$watch('types', function(types) {
			console.log("types changed");
		},true);
	}])


	
.directive('prettyType', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	false,
		scope:		{
						node:			"=",
						primarylang:	"=",
						fallbacklang:	"=",
						owlgraph:		"=",
						owlendpoint:	"="
					},
		//template:	'<span compile={{type.uri}}>{{typestring}}</span>'
		//template:	'<span compile="nodedisplay"></span>',
		template:	'<span><a href="{{url}}" dbpv-preview>{{label}}</a></span>',
		controller:	'PrettyTypeCtrl'
	};
})

	.controller('PrettyTypeCtrl', ['$scope', '$filter', 'Preview', 'UrlService', function($scope, $filter, Preview, UrlService) {
		//$scope.$watch('node', function(node) {
			var local = false;
			var url = $scope.node.uri;
			$scope.label = $scope.node.uri;
			var prefshor = UrlService.prefixify($scope.node.uri);
			var urlobj = UrlService.makeUrl($scope.node.uri);
			url = urlobj.uri;
			var display = "";
			if (prefshor !== undefined && prefshor.length > 1) {
				$scope.url = url;
				if (true || urlobj.local) {
					$scope.label = prefshor[1];
					display = '<a href="'+url+'"'+' dbpv-preview>'+$scope.label+'</a>';
				} else {
					$scope.label = prefshor[0] + ":" + prefshor[1];
					display = '<a href="'+url+'">'+$scope.label+"</a>";
				}
				$scope.nodedisplay = display;
			}
			
			$scope.labellist = Preview.getProperty($scope.node.uri, "http://www.w3.org/2000/01/rdf-schema#label", $scope, "", $scope.owlendpoint);
			
			$scope.updateLabel = function (list) {
				var labl = $filter('languageFilter')(list, $scope.primarylang, $scope.fallbacklang)[0];
				if (labl !== undefined) {
					labl = labl.literalLabel.lex;
					$scope.label = labl;
				}
			};
			
			$scope.$watch('labellist', function (list) {
				$scope.updateLabel($scope.labellist); // WHY U NO UPDATE WHEN PREVIEW RESPONSE COMES IN???????
			}, true);
			$scope.$watch('primarylang', function(lang) {
				$scope.updateLabel($scope.labellist);
			});
		//});*/
	}])

;