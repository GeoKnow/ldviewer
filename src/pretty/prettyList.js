
angular.module('ldv.pretty.list', ['ldv.table.displayNode'])
.directive('dbpvpList', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						properties:	"=",
						primarylang:"=",
						fallbacklang:"="
					},
		template:	'<div id="dbpvpproperties" ng-show="showProperties()"><table id="dbpvplist"><tr ng-repeat="property in properties | orderBy:prioSort" class="propertyentry"><td class="propertykey">{{property.key}}:</td><td  class="propertyvalues"><div ng-repeat="value in property.values"><div display-node node="value" settings="displayset" class="propertyvalue" primarylang="primarylang" fallbacklang="fallbacklang"></div></div></div></td></tr></table></div>',
		controller:	'DbpvpListCtrl'
	}
})

	.controller('DbpvpListCtrl', ['$scope', function($scope) {
		$scope.showProperties = function() {
			return $scope.properties.length > 0;
		};
		
		$scope.displayset = {"noprefix":true};
		
		$scope.prioSort = function(property) {
			if (property && property.priority) {
				return property.priority;
			} else {
				return 0;
			}
		};
		
		dbpv.getPrettyPropertyAdder = function(key, priority) {
			if (key && key.length && key.length > 0) {
				var property = null;
				for (var i = 0; i < $scope.properties.length; i ++) {
					if ($scope.properties[i].key == key) {
						property = $scope.properties[i];
						break;
					}
				}
				if (! property) {
					property = {};
					property.key = key;
					property.values = [];
					$scope.properties.push(property);
				}
				if (property) {
					property.priority = priority;
					return function(value) {
						if (value) {
							property.values.push(value);
						}
					};
				}
			}
		};		
		
	}])

;