
angular.module('ldv.ui.disclaimer', ['ldv.templates.ui'])
.directive('dbpvDisclaimer', function() {
	return {
		restrict:	"EA",
		replace:	true,
		scope:		{
						about:		"=",
						localgraph:	"="
					},
		controller:	'DbpvDisclaimerCtrl',
		templateUrl:	'ui/disclaimer/disclaimer.html'
	};
})

	.controller('DbpvDisclaimerCtrl', ['$scope', function($scope) {
		console.log("disclaimer");
		$scope.suffix = "/resource/";
		$scope.disclaimed = false;
		
		LDViewer.setFooterWikipage = function(settings) {
			$scope.wikipage = settings;
		};
		
		if ($scope.about.uri.indexOf($scope.localgraph + $scope.suffix) != -1) {
			$scope.about.title = $scope.about.uri.slice(($scope.localgraph+$scope.suffix).length, $scope.about.uri.length);
			$scope.about.datalink = "/data/"+($scope.about.title);
			$scope.disclaimed = true;
		} else {
		}
	}])

;
