angular.module('ldv.ui.shortcuts', ['ldv.ui.custom', 'ldv.services.UrlService', 'ldv.ui.custom', 'ldv.templates.ui'])
.directive('shortcutBox', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						/*shortcuts:	"="//*/
					},
		templateUrl:	'ui/shortcuts/shortcuts.html',
		controller:	"ShortcutBoxCtrl"
					
	};
})

	.controller('ShortcutBoxCtrl', ['$scope', function($scope) {
		$scope.shortcuts = [];
		LDViewer.addShortcut = function(url, label, prio) {
		//$scope.$apply(function() {
			var neue = {"url": url, "label":label, "prio":prio};
			var prevbigger = false;
			var added = false;
			var duplicate = false;
			for (var i = 0; i<$scope.shortcuts.length; i++) {
				if (url == $scope.shortcuts[i].url) {
					duplicate = true;
					break
				}
			}
			if (!duplicate) {
				for (var i = 0; i<$scope.shortcuts.length; i++) {
					if ($scope.shortcuts[i].prio < neue.prio) {
						$scope.shortcuts.splice(i,0,neue);
						added = true;
						break;
					}
				}
				if ($scope.shortcuts.length == 0 || !added) {
					$scope.shortcuts.push(neue);
				}
			}
		//});
		};
	}])
	
.directive('shortcut', ['$compile', 'UrlService', function ($compile, UrlService) {
	return {
		restrict:	"EA",
		link: 	function (scope, element, attrs) {
				var pred = scope.$eval(attrs.shortcut);
				var label = scope.$eval(attrs.shortcutLabel);
				
				scope.useShortcut = function() {
					pred = UrlService.makeUrl(pred).uri;
					var amt = $("a[href='"+pred+"']");
					if (amt !== undefined) {
						amt = parseInt(amt.offset().top)-10.0;
						$('body,html').animate({scrollTop: amt}, 100);
						return false;
					}
				};
				
				element.html("<a href='javascript:void(0);' ng-click='useShortcut();'>"+label+"</a>");
				$compile(element.contents())(scope);
			}
		};
}])
;