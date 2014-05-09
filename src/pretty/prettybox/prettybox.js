angular.module('ldv.pretty', ['ldv.pretty.types', 'ldv.pretty.links', 'ldv.pretty.list', 'ldv.pretty.map', 'ldv.filters', 'ldv.templates.pretty'])

.directive('prettyBox', function() {
	return {
		restrict:	'EA',
		transclude:	false,
		replace:	true,
		scope:		{
						about:	"=",
						primarylang:	"=",
						fallbacklang:	"=",
						owlgraph:		"=",
						owlendpoint:	"="
					},
		templateUrl:	'pretty/prettybox/prettybox.html',
		controller:	"PrettyBoxCtrl"
	};
})

	.controller('PrettyBoxCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {		
		LDViewer.applyPrettyBox = function(fn) {
			//$scope.$apply(
				fn($scope.dbpvp);
			//);
		}
		$scope.entitySemaphore = $rootScope.entitySemaphore;
		$scope.dbpvp = {};
		$scope.dbpvp.properties = [];
		
	}]);

;
