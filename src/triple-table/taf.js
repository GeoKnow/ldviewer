
angular.module('ldv.table.taf', [])
.directive('tripleActions', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		template:	'<span class="dbpv-taf"><span ng-repeat="action in taf"><span triple-action="action" value="value" predicate="predicate" about="about"></span></span>',
		scope:		{
						taf:	"=tripleActions",
						about:	"=",
						predicate:"=",
						value:	"="
					},
		controller:	'TripleActionsCtrl'
	};
})

	.controller('TripleActionsCtrl', ['$scope', function($scope) {
		if ($scope.taf !== undefined) {
			//alert("has actions");
		}
}])


.directive('tripleAction', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						action:	"=tripleAction",
						about:	"=",
						predicate:"=",
						value:	"="
					},
		template:	'<span><a href="javascript:void(0);" title="{{action.description}}" ng-click="action.execute(about, predicate, value);"> <span ng-bind-html-unsafe="action.display();"></span> </a></span>'
	};
});

