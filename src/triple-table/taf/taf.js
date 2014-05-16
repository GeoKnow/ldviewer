
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
		templateUrl:	'triple-table/taf/tripleAction.html',
		controller:		'TripleActionCtrl'
	};
})
.controller('TripleActionCtrl', ['$scope', function($scope) {
	//console.log($scope.action);
	if ($scope.action.actions !== undefined && $scope.action.actions.length>0) {
		$scope.group = true;
		//alert("it's a group!");
	} else {
		$scope.group = false;
		//alert("it's not a group"+$scope.action.group);
	}
}])
.directive('tripleGroup', function() {
	return {
		restrict:	"EA",
		replace:	true,
		scope:		{
						action:	"="
					},
		template:	'<div ng-show="doshow"></div>'
	};
})
;



