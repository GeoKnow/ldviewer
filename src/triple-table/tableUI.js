
var tableUI = angular.module('ldv.ui.filters', []);

tableUI.directive('predicateFilter', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		template:	'<input class="form-control dbpv-input dbpv-filter dbpv-filter-pred" ng-model="predfilter" data-intro="Filter predicates using a string." data-step="4"/>',
		scope:		{
						predfilter:	"="
					}/*,
		controller:	'PredicateFilterController'*/
	};
})
/*	.controller('PredicateFilterController', ['$scope', '$timeout', function($scope, $timeout) {
		//$scope.currentpromise = null;
		$scope.$watch('predfil', function(predfil) {
			$scope.predfilter = $scope.predfil;
			/*if ($scope.currentpromise !== null) {
				$timeout.cancel($scope.currentpromise);
			}
			$scope.currentpromise = $timeout($scope.update, 500);
		});
		/*
		$scope.update = function() {
			//alert("update predfilter");
			$scope.predfilter = $scope.predfil;
		};
	}
])*/
;

tableUI.directive('valueFilter', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		template:	'<input class="form-control dbpv-input dbpv-filter dbpv-filter-val" ng-model="valfilter" data-intro="Filter values using a string." data-step="5"/>',
		scope:		{
						valfilter:	"="
					}/*,
		controller:	'ValueFilterController'*/
	};
})
/*	.controller('ValueFilterController', ['$scope', '$timeout', function($scope, $timeout) {
		$scope.currentpromise = null;
		$scope.prevpromise = null;
		
		$scope.update = function() {
			//alert("update predfilter");
			$scope.valfilter = $scope.valfil;
			$scope.$apply();
		};
		
		$scope.$watch('valfil', function(predfil) {
			//$scope.valfilter = $scope.valfil;
			$scope.prevpromise = $scope.currentpromise;
			$scope.currentpromise = $timeout(function() {
				$scope.valfilter = $scope.valfil;
			}, 500);
			if ($scope.prevpromise !== null) {
				$timeout.cancel($scope.prevpromise);
			}
		});
		
		$scope.$watch('valfilter', function(valfilter) {
			$scope.valfil = valfilter;
		});
	}
])
*/
;
