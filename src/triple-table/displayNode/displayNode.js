var nodeModule = angular.module('ldv.table.displayNode', ['ldv.compile', 'ldv.filters', 'ldv.services.UrlService', 'ldv.templates.tripletable']);

nodeModule.directive('displayNode', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		template:	'<span compile="nodedisplay"></span>',
		controller:	'DisplayNodeCtrl',
		scope:		{
						node:		"=",
						primarylang:"=",
						fallbacklang:"=",
						settings:	"=",
						showlanguage:	"="
					}
	};
})
	.controller('DisplayNodeCtrl', ['$scope', 'UrlService', '$rootScope', '$filter' ,function($scope, UrlService, $rootScope, $filter) {
		if ($scope.settings === undefined) {
			//alert($scope.node);
		}
		if (!$scope.showlanguage) {
			$scope.showlanguage = true;
		}
		$scope.updatePlainLiteral = function(node) {
			var suffix = '<span class="valuetype">@'+$scope.node.literalLabel.lang+'</span>';
			var label = $scope.node.literalLabel.val;
			if ($scope.node.literalLabel.lex === undefined) {
				$scope.node.literalLabel.lex = label;
			} else {
				label = $scope.node.literalLabel.lex;
			}
			if ($scope.showlanguage) {
				label += " " + suffix;
			}
			$scope.nodedisplay = label;
		};
		//alert(JSON.stringify($scope.prefixes));
		
		$scope.updateDisplay = function() {
			if ($scope.node.uri !== undefined) {
				var local = false;
				var url = $scope.node.uri;
				var label = $scope.node.uri;
				var lex = $scope.node.uri;
				
				var prefshor = UrlService.prefixify($scope.node.uri);
				if (prefshor !== undefined && prefshor.length > 1) {
					if ($scope.settings && $scope.settings.noprefix || $rootScope.showLabels) {
						label = prefshor[1];
					} else {
						label = '<span class="rdf-prefix">'+prefshor[0]+':</span>'+prefshor[1];
					}
					lex = prefshor[0]+":"+prefshor[1];
				}
				if ($scope.node.displayLabel && $rootScope.showLabels) {
					label = $scope.node.displayLabel;
					lex = label;
				}
				else if ($scope.node.labelNodes && $rootScope.showLabels) {
					//label = '<span ng-repeat="n in node.labelNodes | languageFilter:primarylang:fallbacklang"><span display-node node="n" primarylang="primarylang" fallbacklang="fallbacklang" settings="settings" showlanguage="false"></span></span>';
					var filtlabel = $filter('languageFilter')($scope.node.labelNodes, $scope.primarylang, $scope.fallbacklang);
					if (filtlabel && filtlabel.length > 0) {
						label = filtlabel[0].literalLabel.val;
						lex = label;
					}
				}
				var urlobj = UrlService.makeUrl($scope.node.uri);
				url = urlobj.uri;
				var args = "";
				if (urlobj.local) {
					args += ' dbpv-preview';
				}
				if ($scope.node.nofollow) {
					args += ' rel="nofollow"';
				}
				var display = '<a href="'+url+'"'+args+">"+label+"</a>";
				if ($scope.node.forward !== undefined && $scope.node.forward == false) {
					display = "is "+display+" of";
				}
				$scope.node.lex = lex;
				$scope.nodedisplay = display;
				
			} else if ($scope.node.literalLabel !== undefined) {
				var label = "";
				var suffix = "";
				//$scope.nodedisplay = $scope.node.literalLabel.lex;
				if ($scope.node.literalLabel.dtype === undefined && $scope.node.literalLabel.lang !== undefined) {
					$scope.updatePlainLiteral($scope.node);
					$scope.$watch('node.literalLabel.lex', function(newlex) {
						$scope.updatePlainLiteral($scope.node);
					});
				} else if ($scope.node.literalLabel.dtype !== undefined) {
					suffix = $scope.node.literalLabel.dtype.datatypeUri;
					var prefshor = UrlService.prefixify(suffix);
					if (prefshor !== undefined && prefshor.length>1) {
						suffix = prefshor[0]+":"+prefshor[1];
					}
					label = $scope.node.literalLabel.lex;
					if ($scope.node.literalLabel.lex === undefined) {
						$scope.node.literalLabel.lex = label;
					}
					if (suffix !== undefined) {
						label = label + '<span class="valuetype"> (' + suffix + ")</span>";
					}
				}
				$scope.nodedisplay = label;
			}
		};
		
		$scope.updateDisplay();
		
		if ($rootScope.showLabels) {
			$scope.$watch('node.labelNodes', function(node) {
				$scope.updateDisplay();
			});
			
			$scope.$watch('primarylang+fallbacklang', function(x) {
				$scope.updateDisplay();
			});
		}
		
		$scope.updateTypedLiteral = function(node) {
			
		};
	}])
;