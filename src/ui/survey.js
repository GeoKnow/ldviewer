
angular.module('ldv.ui.survey', [])
.directive('dbpvSurvey', function() {
	return {
		restrict: 	"EA",
		replace:	true,
		scope: 		{},
		template:	'<div id="survey" ng-show="showSurvey"><img class="btn-survey" src="/statics/surveyrequest.png" ng-click="surveyClicked()"/></div>',
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
