
angular.module('ldv.ui.topbar', ['ldv.ui.languageSwitch', 'ldv.compile', 'ldv.ui.lookup', 'ldv.ui.settings', 'ldv.ui.legend', 'ldv.templates.ui'])
.directive('dbpvTopbar', function() {
	return {
		restrict:	"EA",
		replace:	true,
		scope:		{
						logo:			"=",
						primarylang:	"=",
						languages:		"=",
						lookupendpoint:	"=",
						lookupgraph:	"=",
						localgraph:		"=",
						localprefix:	"="
					},
					
		templateUrl:	'ui/topbar/topbar.html'
	};
})


.directive('dbpvTopbuttons', function() {
	return {
		restrict: 	"EA",
		replace:	true,
		scope:		{
		
					},
		templateUrl:	'ui/topbar/topbarbutton.html',
		controller:	"DbpvTopbuttonsCtrl"
	};
})

	.controller('DbpvTopbuttonsCtrl', ['$scope', function($scope) {
		$scope.buttons = [];
		
		$scope.content = "";
		$scope.showContent = false;
		
		$scope.activeButton = null;
		
		$scope.buttons = [
							{"id":"settings", "description": "Change Settings", "css-id": "dbpv-settingsbutton", "display": '<span class="glyphicon glyphicon-cog"></span>', "execute": function() {
									$scope.content = '<div dbpv-settings></div>';
									$scope.showContent = true;
								},
								"nexecute": function() {
									$scope.content = "";
									$scope.showContent = false;
								}},
							{"id":"tour", "description": "Take a tour", "css-id": "dbpv-tourbutton", "display": '<span class="glyphicon glyphicon-bookmark"></span>', "execute": function(){
								var custom = introJs().setOptions({"skipLabel":"", "nextLabel":"<span class='glyphicon glyphicon-arrow-right'></span>", "prevLabel":"<span class='glyphicon glyphicon-arrow-left'></span>"});
								$scope.inactivateActiveButton();
				custom.start();}},
							{"id":"legend", "description": "View Legend", "css-id": "dbpv-legendbutton", "display": '<span class="glyphicon glyphicon-book"></span>', "execute": function() {
								$scope.content = "<div dbpv-legend></div>";
								$scope.showContent = true;
							},
							"nexecute": function() {
								$scope.content = "";
								$scope.showContent = false;
							}}
						 ];
						 
		$scope.buttonClicked = function(button) {
			/*for (var i = 0; i < $scope.buttons.length; i++) {
				$scope.buttons[i].active = false;
			}
			button.active = true;//*/
			if ($scope.activeButton == button) {
				$scope.inactivateActiveButton();
			} else {
				if ($scope.activeButton && $scope.activeButton.nexecute) $scope.activeButton.nexecute();
				$scope.activeButton = button;
				if (button.execute) button.execute();
			}
		};
		
		$scope.inactivateActiveButton = function() {
			if ($scope.activeButton) {
				if ($scope.activeButton.nexecute) $scope.activeButton.nexecute();
				$scope.activeButton = null;
			}
		};
		
		$scope.buttonActive = function(button) {
			return ($scope.activeButton == button? "active": "inactive");
		};
	}])

;
