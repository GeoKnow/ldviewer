
var tableUI = angular.module('ldv.ui.filters', ['ldv.templates.tripletable']);

tableUI.directive('predicateFilter', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		templateUrl:	'triple-table/tableUI/predicateFilter.html',
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
		templateUrl:	'triple-table/tableUI/valueFilter.html',
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
