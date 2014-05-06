
angular.module('ldv.ui.disclaimer', [])
.directive('dbpvDisclaimer', function() {
	return {
		restrict:	"EA",
		replace:	true,
		scope:		{
						about:		"=",
						localgraph:	"="
					},
		controller:	'DbpvDisclaimerCtrl',
		template:	'<div id="ft_ccbysa" ng-show="disclaimed">	This content was extracted from <a href="http://www.wikipedia.org">Wikipedia</a> and is licensed under the <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>	</br>	The content on this page was created by the <a href="{{wikipage.history}}">editors of the Wikipedia page {{wikipage.title}}</a>.      </div>'
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
