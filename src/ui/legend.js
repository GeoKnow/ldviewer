
angular.module('ldv.ui.legend', [])
.directive('dbpvLegend', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						
					},
		//template:	"<div>haha</div>",
		template:	'<div id="legend" ><h2 style="margin-top:0;">Legend</h2>	<div class="container" id="legends">		<div class="legend" ng-repeat="legend in legends">			<div class="name">{{legend.name}}</div>			<div class="description">{{legend.description}}</div>			<div class="line" ng-repeat="line in legend.lines">				<span ng-bind-html-unsafe="line.icon"></span> : {{line.text}}			</div>		</div>	</div></div>',//*/
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
			if (typeof(action.legendize) != "undefined") {
				$scope.addLegend(action.legendize());
			}
		}//*/
	}])

;//*/