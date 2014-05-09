
angular.module('ldv.table.taf', ['ldv.templates.tripletable'])
.directive('tripleActions', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		templateUrl:	'triple-table/taf/taf.html',
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
		templateUrl:	'triple-table/taf/tripleAction.html'
	};
});

