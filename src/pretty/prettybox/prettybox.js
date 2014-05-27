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
		
		$rootScope.$watch('entitySemaphore', function(semaphore) {
			$scope.semaphore = semaphore;
		});
		
		$scope.dbpvp = {};
		$scope.dbpvp.properties = [];
		$rootScope.$watch('failMessage', function(msg) {
			if (msg) {
				$scope.loadmsg = msg;
				$scope.showMsg = true;
			} else {
				$scope.showMsg = false;
			}
		});
		
	}]);

;
