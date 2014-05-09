angular.module('ldv.ui.settings', ['ldv.templates.ui'])
.directive('dbpvSettings', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
		
					},
		templateUrl:	'ui/settings/settings.html',
		controller:	"DbpvSettingsController"
	}
})

	.controller('DbpvSettingsController', ['$rootScope', '$scope', function($rootScope, $scope) {
		$scope.settingsmap = [
			{"id":"localprefix", "label": "Local Prefix", "type": "string", "prio": 0},
			{"id": "localgraph", "label": "Graph URI", "type": "string", "prio": 1},
			{"id": "endpoint", "label": "Endpoint URI", "type": "string", "prio": 2},
			{"id": "fallbacklang", "label": "Fallback Language", "type": "lang", "prio": 0},
			{"id": "encodegraph", "label": "Encode Graph", "type": "boolean", "prio": 5},
			{"id": "godmode", "label": "GraffHopper", "type": "boolean", "prio": 6},
			{"id": "showLabels", "label": "Show Labels", "type": "boolean", "prio": 4},
		];
		
		$scope.settings = [];
		
		$scope.reset = function() {
			var cookies = $.cookie();
			for (var key in cookies) {
				var settingsprefix = "dbpv_setting_";
				if (key.slice(0, settingsprefix.length) == settingsprefix) {
					$.removeCookie(key);
				}
			}
			$scope.refresh();
		};
		
		$scope.refresh = function() {
			for (var i = 0; i < $scope.settings.length; i++) {
				if ($scope.saveInRoot($scope.settings[i]))
					$scope.saveAsCookie($scope.settings[i]);
			}
			window.location.reload(false);
		};
		
		$scope.makeSettings = function() {
			for (var i = 0; i < $scope.settingsmap.length; i++) {
				var setting = $scope.settingsmap[i];
				if (setting.prio > 0) {
					var cookied = $scope.loadFromCookies(setting.id);
					if (cookied) {
						setting.value = cookied;
						if (setting.type == "boolean") {
							setting.value = (setting.value == "true"? true:false);
						}
						$scope.saveInRoot(setting);
					} else {
						setting.value = $rootScope[setting.id];
					}
					if (setting.value !== undefined) {
						var added = false;
						for (var j = 0; j < $scope.settings.length; j++) {
							if ($scope.settings[j].prio > setting.prio) {
								$scope.settings.splice(j, 0, setting);
								added = true;
								break;
							}
						}
						
						if (!added) {
							$scope.settings.push(setting);
						}
					}
				}
			}
			console.log(JSON.stringify($scope.settings));
		};
		
		$scope.saveInRoot = function(setting) {
			if ($rootScope[setting.id]!== undefined && setting.value != $rootScope[setting.id]) {
				$rootScope[setting.id] = setting.value;
				return true;
			}
			return false;
		};
		
		$scope.watchSettings = function() {
			$scope.$watch('settings', function(settings) {
				for (var i = 0; i < settings.length; i++) {
					if ($scope.saveInRoot(settings[i]))
						$scope.saveAsCookie(settings[i]);
				}
				
			}, true);
		};
//*/
		
		$scope.saveAsCookie = function(setting) {
			if (setting.id && setting.value !== undefined) {
				$.cookie("dbpv_setting_"+setting.id, setting.value, {expires:90, path: '/'});
			}
		};
		
		$scope.loadFromCookies = function(settingid) {
			if ($.cookie("dbpv_setting_"+settingid) !== undefined) {
				return $.cookie("dbpv_setting_"+settingid);
			}
		};
		
		$scope.makeSettings();
		//$scope.watchSettings();
	}])

;
