angular.module('ui-densor', [])

.directive('densor', function() {
	return {
		restrict: 	"EA",
		replace: 	true,
		scope:		{
			data:	"=",
			min:	"=",
			max:	"=",
			levels:	"=",
			top:	"=",
			bottom:	"="
		},
		templateUrl:	'ui/densor/densor.html',
		controller:	'DensorCtrl'
	}
})

.controller('DensorCtrl', ['$scope', function($scope) {
	$scope.buckets = [1,2,3,4,3,4,2,2,5,2,1,5,5];
	
	
}])

;