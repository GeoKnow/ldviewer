
angular.module('ldv.ui.languageSwitch', ['ldv.services.languages'])
.directive('dbpvLanguageSwitch', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						primarylang:	"=",
						languages:		"="
					},
		controller:	'DbpvLanguageSwitchCtrl',
		template:	'<div data-intro="Filter by language." data-step="2" class="input-group-btn">					<button type="button" class="btn btn-default dropdown-toggle language-button" data-toggle="dropdown"><span style="font-size:0.8em;" class="glyphicon glyphicon-globe"></span> <span ng-bind="getNativeName(primarylanguage);"></span></button>				        <ul class="dropdown-menu">					  <li ng-repeat="(code, names) in availableLanguages"><a href="javascript:void(0);" ng-click="selectLanguage(code);">{{names.nativeName}}</a></li>					  <li class="divider"></li>					  <li class="unavailable" ng-repeat="(code, names) in restLanguages()"><a href="javascript:void(0);" ng-click="selectLanguage(code);">{{names.nativeName}}</a></li>					</ul>				</div>'
	};
})

	.controller('DbpvLanguageSwitchCtrl', ['$scope', 'LanguageService', function($scope, LanguageService) {
		if ($.cookie("dbpv_primary_lang") === undefined) {
			$.cookie("dbpv_primary_lang", $scope.primarylang, {expires:90, path: '/'});
		}
		$scope.primarylanguage = $.cookie("dbpv_primary_lang");

		$scope.availableLanguages = {};
		$scope.newAvailableLanguage = function (args) {
			$scope.availableLanguages[args] = LanguageService.languages[args];
		};
		
		LDViewer.newAvailableLanguage = $scope.newAvailableLanguage;
		
		$scope.restLanguages = function() {
			var ret = {};
			for (var code in LanguageService.languages) {
				if (! (code in $scope.availableLanguages)) {
					ret[code] = LanguageService.languages[code];
				}
			}
			return ret;
		};

		$scope.$watch('primarylanguage', function(lang) {
			$scope.primarylang = lang;
			$.cookie("dbpv_primary_lang", lang);
			if (! (lang in $scope.availableLanguages)) {
				var more = false;
				for (var k in $scope.availableLanguages) {
					more = true;
					break;
				}
				if (more) LDViewer.addNotification("There are no values in the chosen language for this entity", 5000);
			}
			//$scope.$apply();
		});

		$scope.addNoti = function (text, timeout) {
			$scope.$broadcast("show notification", {"text":text, "timeout":timeout});
		};

		$scope.getNativeName = function(code) {
			return LanguageService.languages[code].nativeName;
		};

		$scope.selectLanguage = function(code) {
			$scope.primarylanguage = code;
		};
	}])

;
