
angular.module('ldv.ui.legend', ['ldv.templates.ui'])
.directive('dbpvLegend', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						
					},
		//template:	"<div>haha</div>",
		templateUrl:	'ui/legend/legend.html',//*/
		controller:	'DbpvLegendCtrl'
	};
})

	.controller('DbpvLegendCtrl', ['$scope', 'TafService', function($scope, TafService) {
		$scope.legends = [];
		
		$scope.addLegend = function(legend) {
			$scope.legends.push(legend);
		};
		
		$scope.actions = TafService.getActions();
		
		for (var i = 0; i < $scope.actions.length; i++) {
			var action = $scope.actions[i];
			if (typeof(action.legend) != "undefined") {
				$scope.addLegend(action.legend);
			}
			if (action.group !== undefined && action.group.length > 0) {
				for (var j = 0; j < action.group.length; j++) {
					var act = action.group[j];
					if (typeof(act.prototype.legend) != "undefined") {
						$scope.addLegend(act.prototype.legend);
					}
				}
			}
		}//*/
	}])

;//*/