angular.module('ldv.preview', ['ldv.filters','ldv.templates.ui'])
.directive('dbpvPreview', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	false,
		controller:	'DbpvPreviewCtrl',
		link:	function(scope, element, attrs) {
						var uri = undefined;
						if (attrs.dbpvPreview && attrs.dbpvPreview != "") {
							uri = attrs.dbpvPreview;
						} else {
							if (!scope.node || ! scope.node.uri) {
								uri = attrs.href;
							} else {
								uri = scope.node.uri;
							}
						}
						scope.calll(uri, element);
						

					//});
					//console.log("empty");
				}
	};
})
	.controller('DbpvPreviewCtrl', ['$scope', '$timeout', '$compile', 'Preview', 'UrlService', function($scope, $timeout, $compile, Preview, UrlService) {
		$scope.calll = function(uri, element) {
			//alert($scope.url);
			element.bind("mouseenter", function() {$scope.onElementHover(uri, element);});
			element.bind("mouseleave", $scope.onElementUnhover);
		};
		
	$scope.populatePreview = function(node, dbpvp, scope) {
		//scope.$apply(function() {
		/*var mappings = LDViewer.getConfig('previewMappings');
		Preview.getPreview(node, mappings, scope);//*/
			scope.previewSemaphore = 1;
			var mappings = LDViewer.getConfig('previewMappings');
			for (var key in mappings) {
				if (mappings[key] instanceof Object) {
					if (dbpvp[key] === undefined) {
						dbpvp[key] = {};
					}
					for (var subkey in mappings[key]) {
						dbpvp[key][subkey] = Preview.getProperty(node, mappings[key][subkey], scope, UrlService.localgraph(), UrlService.endpoint());
					}
				} else {
					dbpvp[key] = Preview.getProperty(node, mappings[key], scope, UrlService.localgraph(), UrlService.endpoint());
				}
			}
			//*/
	};
		
		$scope.onElementHover = function(uri, element) {
			if (!$scope.to) {
				$scope.to = $timeout(function() {
					if ($scope.dbpvp === undefined) {
						$scope.dbpvp = {};
					}
					//$scope.dbpvp.url = $scope.url;
					$scope.dbpvp.position = element.offset();
					//console.log(JSON.stringify($scope.dbpvp.position));
					$scope.dbpvp.position.top = $scope.dbpvp.position.top + element.height();
					//$timeout.cancel(to);
					$scope.dbpvp.show = true;
					uri = UrlService.defaultUri(uri);
					$scope.populatePreview(uri, $scope.dbpvp, $scope);
					element.after('<div id="dbpvpreview" style="position:absolute;top:{{dbpvp.position.top}}px;left:{{dbpvp.position.left}}px;" ><div id="dbpvpthumbnail">				<img ng-src="{{dbpvp.thumbnail[0].uri}}"></img>			</div><div id="dbpvptext">			<div id="dbpvplabel">				<span ng-repeat="value in dbpvp.label |languageFilter:primarylang:fallbacklang">					{{value.literalLabel.lex}}				</span>			</div>			<div id="dbpvpdescription">				<span ng-repeat="value in dbpvp.description |languageFilter:primarylang:fallbacklang">					{{value.literalLabel.lex}}				</span>			</div>			</div><div ng-repeat="(key, val) in dbpvp.properties">				<div id="dbpvpdescription">					<span ng-show="val.length>0">						{{key}}:						<a href="{{val[0].uri}}">							{{val[0].lex}}						</a>					</span>				</div>			</div><div id="loading" ng-show="previewSemaphore>0">			<center><img style="margin-bottom:15px;" src="/statics/css/ajax-loader.gif"></img></center>		</div></div>');
					$compile(element.next())($scope);
					//$scope.bleh = "this is new bleh";
				}, 800);
			}
		};
		
		$scope.$watch('dbpvp.properties', function(props) {
			for (var key in props) {
				var vals = props[key];
				for (var i = 0; i < vals.length; i++) {
					var val = vals[i];
					var prefshor = UrlService.prefixify(val.uri);
					if (prefshor !== undefined && prefshor.length > 1) {
						val.lex = prefshor[0]+":"+prefshor[1];
					} else {
						val.lex = val.uri;
					}
				}
			}
		}, true);
		
		$scope.onElementUnhover = function() {
			//alert("unhovered");
			
			$('#dbpvpreview').remove();
			if ($scope.to) {
				$timeout.cancel($scope.to);	
				$scope.to = undefined;
			}//*/
		};
}])



.directive('dbpvPreviewBox', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		templateUrl:	'ui/preview/preview.html',
		scope:		{
						dbpvp:	"=",
						primarylang:	"=",
						fallbacklang:	"="
					}
	}
});