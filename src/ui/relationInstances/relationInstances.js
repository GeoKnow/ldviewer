
angular.module('ldv.ui.relationInstances', ['ldv.table.displayNode', 'ldv.templates.ui'])
.directive('dbpvRelationInstances', function() {
	return {
		restrict:	"EA",
		replace:	true,
		scope:		{
						about:	"=",
						primarylang:	"=",
						fallbacklang:	"="
						
					},
		templateUrl:	'ui/relationInstances/relationInstances.html',
		controller:	"DbpvRelationInstancesCtrl",
	};
})

	.controller('DbpvRelationInstancesCtrl', ['$scope', 'Entity', function($scope, Entity) {
		
		LDViewer.showRelationInstances = function() {
			$scope.showInstances = true;
			console.log("getting instances");
			$scope.loadInstances(25);
		};
		
		$scope.loadInstances = function(number) {
			Entity.relationInstances($scope.about.uri, number)
				.then(
					function(instances) {
						$scope.instances = instances;
					}
				)
			;
		};
	}])
	
;