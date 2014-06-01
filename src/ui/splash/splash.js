angular.module('ldv.ui.splash', [])
.directive('ldvSplash', function() {
	return {
		restrict:	"EA",
		replace:	true,
		template:	'<div ng-show="show" id="ldv-splash" style="position:absolute; top:0; left:0; background-color: #57f; z-index:2000; width: 100%; height:100%;font-size: 3em; color:white;text-align:center; padding-top:100px;">LOADING...</div>',
		controller:	'LdvSplashCtrl'
	};
})
.controller('LdvSplashCtrl', ['$rootScope', function($rootScope) {
	$scope.show = false;
	$rootScope.$watch('showSplash', function(showSplash) {
		$scope.show = showSplash;
		$("#ldv-splash").remove();
	});
}])
;