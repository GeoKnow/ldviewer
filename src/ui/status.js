
angular.module('ldv.ui.status', [])
.directive('dbpvStatus', function() {
	return {
		restrict: 	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
		
					},
		controller:	"DbpvStatusCtrl",
		template:	'<div id="dbpv-status"><div ng-repeat="status in stasi" class="status-item"><span ng-bind-html-unsafe="status.icon" ng-click="removeStatus(status)"></span><span>{{status.text}}</span></div></div>'
	};
})
	
	.controller('DbpvStatusCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
		$scope.stasi = [];
		$scope.kgb = 0;
		$scope.stasiSemaphore = 0;
		$scope.stasiChange = 0;
	
		$scope.addStatus = function(text, icon) {
			if (text) {
				var status = {"text":text, "icon":icon};
				return $scope.getStatusHandler(status);
			}
		};
		
		$scope.getStatusHandler = function(status) {
			$scope.stasi.push(status);
			$scope.kgb ++;
			$scope.stasiChange ++;
			status.id = $scope.kgb;
			console.log("New status id :" + status.id);
			return {
				"delete": 	function() {
					$scope.removeStatus(status);
				}
			};
		};
		
		dbpv.addStatus = function(status, icon) {
			return $scope.addStatus(status, icon);
		};
		
		$scope.removeStatus = function(status) {
			if (status && status.text && status.id) {
				console.log("Removing status with id :"+status.id);
				$scope.stasiChange++;
				$scope.stasiSemaphore ++;
				var i = 0; 
				while (i < $scope.stasi.length) {
					if ($scope.stasi[i].id == status.id) {
						$scope.stasi[i].delete = true;
						break;
					}
					i++;
				}
				$scope.stasiSemaphore --;
			}
		};
		
		$scope.$watch('stasiChange', function(s) {
			var sem = $scope.stasiSemaphore;
			console.log("Stasi semaphore :"+sem);
			if (sem == 0) {
				var i = 0;
				while (i < $scope.stasi.length) {
					if ($scope.stasi[i].delete) {
						$scope.stasi.splice(i, 1);
						i--;
					}
					i++;
				}
			}
		});
		
		//var sh = $scope.addStatus({"icon": '<span class="glyphicon glyphicon-book"></span>', "text": "This is a test status"});
		
		
	}])

;