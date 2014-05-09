var valuesModule = angular.module('ldv.table.displayValues', ['ldv.table.displayNode', 'ldv.ui.pagination', 'ldv.filters', 'ldv.table.taf', 'ldv.services.entity', 'ldv.templates.tripletable']);


valuesModule.directive('displayNodeValues', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
						about:		"=",
						predicate:	"=",
						values:		"=",
						valfilter:	"=",
						primarylang:	"=",
						fallbacklang:	"="
					},
		templateUrl:	'triple-table/displayValues/displayNodeValues.html',
		
		controller:	'DisplayNodeValuesCtrl'
		
	};
})

.controller('DisplayNodeValuesCtrl', ['$scope', '$filter', function($scope, $filter) {
		$scope.DisplayNodeValuesCtrl = true;
		var max = 10;
		var lim = 5;
		
		if ($scope.predicate.uri == "http://www.georss.org/georss/point") {
			console.log("GEORSS found");
		}
		
		$scope.moreOrLess = function() {
			if ($scope.showMore) {
				$scope.showAll();
			} else {
				$scope.showLess();
			}
		};
		
		$scope.showLess = function() {
			if ($scope.vals.length > max) {
				for (var i = 0; i < $scope.vals.length; i++) {
					if (i<lim) {
						$scope.vals[i].show = true;
					} else {
						$scope.vals[i].show = false;
					}
				}
				$scope.showButton = true;
			} else {
				for (var i = 0; i < $scope.vals.length; i++) {
					$scope.vals[i].show = true;
				}
				$scope.showButton = false;
			}
		};
		
		$scope.onShowAll = function() {
			$scope.showMore = true;
			$scope.moreOrLess();
		};
		
		$scope.showAll = function() {
			for (var i = 0; i < $scope.vals.length; i++) {
				$scope.vals[i].show = true;
			}
			$scope.showButton = false;
		};//*/
		
		$scope.$watch('valfilter+primarylang+fallbacklang', function(f) {
			$scope.applyFilters();
			$scope.moreOrLess();
		});
		
		$scope.applyFilters = function() {
			$scope.vals = $filter('valueFilter')($scope.values, $scope.valfilter);
			$scope.vals = $filter('languageFilter')($scope.vals, $scope.primarylang, $scope.fallbacklang);
		};
		
		$scope.showMore = false;
		$scope.showButton = false;
		$scope.applyFilters();
		$scope.moreOrLess();
		
		$scope.sortValues = function (item) {
			if (item.prefix !== undefined) {
				return item.prefix+item.short;
			}else{
				return item.label;
			}
		};
		
	}]);

;

valuesModule.directive('displayReverseNodeValues', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
						about:		"=",
						predicate:	"=",
						values:		"=",
						valfilter:	"=",
						primarylang:	"=",
						fallbacklang:	"="
					},
		templateUrl:	'triple-table/displayValues/displayReverseNodeValues.html',
		
		controller:	'DisplayReverseNodeValuesCtrl'
		
	};
})

.controller('DisplayReverseNodeValuesCtrl', ['$scope', '$filter', 'Entity', 'TafService', function($scope, $filter, Entity, TafService) {
		var max = 10;
		var lim = 5;
		$scope.limit = 10;
		$scope.offset = 0;
		if (!$scope.predicate.reverseloaded) {
			var pred = $scope.predicate.reverseloaded = {};
			pred.count = 0;
			pred.page = 0;
			pred.table = {};
			pred.loaded = false;
		}
		
		/*$scope.vals = ($scope.predicate.reverseloaded && $scope.predicate.reverseloaded.vals? $scope.predicate.reverseloaded.vals: []);
		$scope.count = ($scope.predicate.reverseloaded && $scope.predicate.reverseloaded.count? $scope.predicate.reverseloaded.count: 0);
		$scope.showButtonLoad = !$scope.predicate.reverseloaded.loaded;
		
		$scope.page = ($scope.predicate.reverseloaded && $scope.predicate.reverseloaded.page? $scope.predicate.reverseloaded.page: 0);
		//*/
		
		$scope.onPageSelect = function(newpage) {
			
		};
		
		$scope.$watch('predicate.reverseloaded.page', function(page) {
				$scope.offset = page*$scope.limit;
				$scope.onLoad();
		});
		
		$scope.onLoadButton = function() {
			$scope.predicate.reverseloaded.loaded = true;
			$scope.onLoad();
		};
		
		$scope.loadCounts = function() {
			if ($scope.predicate.reverseloaded.loaded && $scope.predicate.reverseloaded.count < 1) {
				Entity.loadReverseValuesCount($scope.about, $scope.predicate)
					.then(
						function(results) {
							$scope.predicate.reverseloaded.count = results[0].literalLabel.val;
						}
					)
				;
			}
		};
		
		$scope.getLoaded = function() {
			var loadedresults = [];
			var i = $scope.offset;
			while (i < $scope.offset+$scope.limit) {
				var loadedvalue = $scope.predicate.reverseloaded.table[i];
				if (loadedvalue) {
					loadedresults.push(loadedvalue);
				}
				i++;
			}
			return loadedresults;
		};
		
		$scope.onLoad = function() {
			if ($scope.predicate.reverseloaded.loaded) {
				$scope.loadCounts();
				if ($scope.getLoaded().length == 0) {
					var offset = $scope.offset;
					var limit = $scope.limit;
					Entity.loadReverseValues($scope.about, $scope.predicate, limit, offset)
						.then(
							function(results) {
								$scope.showButtonLoad = false;
								for (var i = 0; i < results.length; i++) {
									if (!$scope.predicate.reverseloaded.table[i+offset]) {
										var resultentry = results[i];
										$scope.values.push(resultentry);
										resultentry.show = true;
										$scope.predicate.reverseloaded.table[i+offset] = resultentry;
									}
								}
								TafService.bindTafPredicate($scope.about, $scope.predicate);
								$scope.applyFilters();
								/*$scope.vals = results;
								$scope.predicate.reverseloaded.vals = $scope.vals;
								for (var i = 0; i < Math.min($scope.limit, results.length); i++) {
									$scope.values.push(results[i]);
									results[i].show = true;
								}
								TafService.bindTafPredicate($scope.about, $scope.predicate);
								$scope.applyFilters();
								//*/
							},
							function(error) {
							
							},
							function(update) {
							
							}
						)
					;
				} else {
					$scope.applyFilters();
				}
			}
		};

		$scope.$watch('valfilter+primarylang+fallbacklang', function(f) {
			$scope.applyFilters();
		});
		
		$scope.applyFilters = function() {
			$scope.vals = $scope.getLoaded();
			$scope.vals = $filter('valueFilter')($scope.vals, $scope.valfilter);
			$scope.vals = $filter('languageFilter')($scope.vals, $scope.primarylang, $scope.fallbacklang);
		};
		
		$scope.applyFilters();
		
		$scope.sortValues = function (item) {
			if (item.prefix !== undefined) {
				return item.prefix+item.short;
			}else{
				return item.label;
			}
		};
		
	}]);

;
