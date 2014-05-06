
angular.module('ldv.ui.topbar', ['ldv.ui.languageSwitch', 'ldv.compile', 'ldv.ui.lookup', 'ldv.ui.settings', 'ldv.ui.legend'])
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
					
		template:	'<div class="navbar top-block"> 		<div class="dbp-logo">			<img ng-src="{{logo}}"></img> 		</div> 		<div id="searchbar">	  			<div class="input-group" id="topstuff">				<span class="input-group-addon glyphicon glyphicon-search"></span>				<div dbpv-lookup lookupgraph="lookupgraph" lookupendpoint="lookupendpoint" localprefix="localprefix"></div> 				<span class="input-group-addon addon-right" title="This is the Named Graph">@ {{localgraph}}</span>				<div dbpv-language-switch primarylang="primarylang" languages="languages"></div>			</div>					</div> <div dbpv-topbuttons></div></div>'
	};
})


.directive('dbpvTopbuttons', function() {
	return {
		restrict: 	"EA",
		replace:	true,
		scope:		{
		
					},
		template:	'<div id="dbpv-topbuttons"><span ng-repeat="button in buttons"><div class="dbpv-topbutton {{buttonActive(button)}}" id="{{button.css-id}}" title="{{button.description}}" ng-click="buttonClicked(button)" compile="button.display"></div></span><div ng-show="showContent" class="dbpv-rightcol top-block" compile="content"></div></div>',
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
