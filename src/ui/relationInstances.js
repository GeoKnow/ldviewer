
angular.module('ldv.ui.relationInstances', ['ldv.table.displayNode'])
.directive('dbpvRelationInstances', function() {
	return {
		restrict:	"EA",
		replace:	true,
		scope:		{
						about:	"=",
						primarylang:	"=",
						fallbacklang:	"="
						
					},
		template:	'<div id="relation-instances" class="top-block" ng-show="showInstances"><div id="relation-instances-top">Some relation instances</div><div id="relation-instances"><div ng-repeat="instance in instances"><div class="relation-instance"><div class="relation-instance-subject"><div display-node node="instance.subj" primarylang="primarylang" fallbacklang="fallbacklang"></div></div><div class="relation-instance-object"><div display-node node="instance.obj" primarylang="primarylang" fallbacklang="fallbacklang"></div></div></div></div></div></div>',
		controller:	"DbpvRelationInstancesCtrl",
	};
})

	.controller('DbpvRelationInstancesCtrl', ['$scope', 'Entity', function($scope, Entity) {
		
		dbpv.showRelationInstances = function() {
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