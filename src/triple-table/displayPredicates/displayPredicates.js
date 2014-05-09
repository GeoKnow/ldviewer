var tripleTableModule = angular.module('ldv.table', ['ldv.table.displayNode', 'ldv.table.displayValues', 'ldv.ui.filters', 'ldv.services.taf', 'ldv.services.entity', 'ldv.templates.tripletable']);

tripleTableModule.directive('displayPredicates', function() {
	return {
		restrict:	"EA",
		replace:	false,
		transclude:	false,
		scope:		{
						about:		"=",
						primarylang:	"=",
						fallbacklang:	"="
					},
		templateUrl:	'triple-table/displayPredicates/displayPredicates.html',
		
		controller:	'DisplayPredicatesCtrl'		,
		link:	function(scope, element, attrs) {
			//alert("linking");
			console.log("linking");
		}
	};
})

	.controller('DisplayPredicatesCtrl', ['$scope', '$timeout', '$filter', 'Entity', 'TafService', '$rootScope', '$q', function($scope, $timeout, $filter, Entity, TafService, $rootScope, $q) {
	
		$scope.sortPredicates = function(item) {
			return item.predid;
		};
	
		$scope.load = function() {
			//alert("controlling");
			
			//var deferred = $q.defer();
			$scope.predicates = {};
			
			//$rootScope.entitySemaphore ++;
			var forwardpromise = Entity.triples($scope.about.uri, $scope.predicates);/*
				.then(
					function(result) {
						jQuery.extend($scope.predicates, result);
						
						$rootScope.entitySemaphore --;
					},
					function(error) {
						$rootScope.entitySemaphore --;
					},
					function(update) {
					
					}
				)
			;
			//*/
			/*
			$scope.$watch('predicates', function(p) {
				TafService.onPredicateChange($scope.about, $scope.predicates);
			},true);
			//*/
			$scope.reversepredicates = {};
			
			
			
			//$rootScope.entitySemaphore ++;
			
			var reversepromise = Entity.reversePredicates($scope.about.uri, $scope.reversepredicates);/*
				.then(
					function(result) {
						//TafService.onPredicateChange($scope.about, $scope.reversepredicates);
						jQuery.extend($scope.predicates, result);
						$rootScope.entitySemaphore --;
					},
					function(error) {
						$rootScope.entitySemaphore --;
					},
					function(update) {
					
					}
				)
			;
			//*/
			$q.all([forwardpromise, reversepromise])
				.then(
					function(resultmap) {
						//alert(JSON.stringify(resultmap));
						jQuery.extend($scope.predicates, resultmap[0]);
						jQuery.extend($scope.predicates, resultmap[1]);//*/
						var empty = true;
						for (var key in $scope.predicates) {
							empty = false;
							break;
						}
						if (empty) {
							(function(uri) {
								$rootScope.loadFailed("No information available for "+$scope.about.uri);
							})($scope.about.uri);
						} else {
							$scope.doTaf = true;
						}
					},
					function(errormap) {
						(function(uri) {
							$rootScope.loadFailed("No information available for "+$scope.about.uri);
						})($scope.about.uri);
					},
					function(updatemap) {
					
					}
				)
			;
		};
		
		$scope.$watch('doTaf', function(doTaf) {
			if (doTaf) {
				TafService.onPredicateChange($scope.about, $scope.predicates);
			}
		});
		
		$scope.doTaf = false;
		
		$scope.load();
	}])
;


tripleTableModule.directive('displayPredicate', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
						about:		"=",
						predicate:	"=",
						valfilter:	"=",
						primarylang:"=",
						fallbacklang:"="
					},
		templateUrl:	'triple-table/displayPredicates/displayPredicate.html'
	};
})

;


tripleTableModule.directive('displayReversePredicate', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
						about:		"=",
						predicate:	"=",
						valfilter:	"=",
						primarylang:"=",
						fallbacklang:"="						
					},
		templateUrl:	'triple-table/displayPredicates/displayReversePredicate.html'
	}
})

;