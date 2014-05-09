
angular.module('ldv.pretty.list', ['ldv.table.displayNode', 'ldv.filters', 'ldv.templates.pretty'])
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
		templateUrl:	'pretty/prettyList/prettyList.html',
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
		
		LDViewer.getPrettyPropertyAdder = function(predicate, priority) {
			if (predicate && predicate.uri) {
				var property = null;
				for (var i = 0; i < $scope.properties.length; i ++) {
					if ($scope.properties[i].key.uri == predicate.uri) {
						property = $scope.properties[i];
						break;
					}
				}
				if (! property) {
					property = {};
					property.key = predicate;
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