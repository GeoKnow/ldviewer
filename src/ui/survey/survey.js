
angular.module('ldv.ui.survey', ['ldv.templates.ui'])
.directive('dbpvSurvey', function() {
	return {
		restrict: 	"EA",
		replace:	true,
		scope: 		{},
		templateUrl:	'ui/survey/survey.html',
		controller:	'DbpvSurveyCtrl'
	};
})

	.controller('DbpvSurveyCtrl', ['$scope', function($scope) {
		if ($.cookie("dbpv_survey") == "true") {
			$scope.showSurvey = false;
		} else {
			$scope.showSurvey = true;
		}
		
		$scope.surveyClicked = function() {
			window.open("https://www.surveymonkey.com/s/N72M2JP");
			$scope.showSurvey = false;
			$.cookie("dbpv_survey", "true", {expires: 90, path: '/'});
		};
	}])

;
