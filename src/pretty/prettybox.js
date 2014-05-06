angular.module('ldv.pretty', ['ldv.pretty.types', 'ldv.pretty.links', 'ldv.pretty.list', 'ldv.pretty.map', 'ldv.filters'])

.directive('prettyBox', function() {
	return {
		restrict:	'EA',
		transclude:	false,
		replace:	true,
		scope:		{
						about:	"=",
						primarylang:	"=",
						fallbacklang:	"=",
						owlgraph:		"=",
						owlendpoint:	"="
					},
		template:	'	<div><div id="dbpvpthumbnail"><img ng-src="{{dbpvp.thumbnail[0].uri}}"></img>	</div>	<div id="dbpvptext">		<div id="dbpvplabel">			<span ng-repeat="value in dbpvp.label |languageFilter:primarylang:fallbacklang">				<a href="{{about.uri}}">{{value.literalLabel.lex}}</a>			</span>		</div>		<div pretty-types types="dbpvp.types" primarylang="primarylang" fallbacklang="fallbacklang" owlgraph="owlgraph" owlendpoint="owlendpoint"></div>		<div id="dbpvpdescription">			<span ng-repeat="value in dbpvp.description |languageFilter:primarylang:fallbacklang">				{{value.literalLabel.lex}}			</span>		</div>		<div pretty-links links="dbpvp.links"></div> <div dbpvp-list properties="dbpvp.properties" primarylang="primarylang" fallbacklang="fallbacklang"></div><div id="loading" ng-show="entitySemaphore>0">			<center><img style="margin-bottom:15px;" src="/statics/css/ajax-loader.gif"></img></center>		</div>	</div></div>',
		controller:	"PrettyBoxCtrl"
	};
})

	.controller('PrettyBoxCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {		
		LDViewer.applyPrettyBox = function(fn) {
			//$scope.$apply(
				fn($scope.dbpvp);
			//);
		}
		$scope.entitySemaphore = $rootScope.entitySemaphore;
		$scope.dbpvp = {};
		$scope.dbpvp.properties = [];
		
	}]);

;
