angular.module('ldv.ui.notifications', ['ldv.templates.ui'])
.directive('dbpvNotifications', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{},
		templateUrl:	'ui/notifications/notifications.html',
		controller:	'DbpvNotificationsCtrl'
	};
})

	.controller('DbpvNotificationsCtrl', ['$scope', '$timeout', function($scope, $timeout) {
		LDViewer.addNotification = function (noti, time) {
			$scope.addNotification(noti, time);	
		};
		
		$scope.notifications = [];

		$scope.$on("show notification", function(event, obj) {
			$scope.addNotification(obj.text, obj.timeout);
		});

		$scope.addNotification = function (text, timeout) {
			var noti = {"text":text};
			if (timeout !== undefined) {
				noti.timeout = $timeout (function () {
					$scope.removeNotification(noti);
				}, timeout);
			}
			$scope.notifications.push(noti);
		};

		$scope.removeNotification = function (noti) {
			for (var i = 0; i<$scope.notifications.length; i++) {
				if (noti == $scope.notifications[i]) {
					$scope.notifications.splice(i,1);
					if (noti.timeout !== undefined) $timeout.cancel(noti.timeout);
				}
			}
		};
	}])

;