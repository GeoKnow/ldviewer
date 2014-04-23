dbpv.filter("valueFilter", function() {
	return function(input, query) {
		if (!query) {
			//console.log("valueFilter value: "+ query);
			//return input;
			//query = angular.element($("body")).scope().valfilter;
			//console.log("valueFilter value: "+ query);
		}
		if (!query) {
			return input;
		} else {
			query = query.toLowerCase();
			var result = [];
			//result.push(input[0]);
			angular.forEach(input, function(value) {
				var label = value.lex;
				if (label === undefined && value.literalLabel !== undefined) {
					label = value.literalLabel.lex;
				}
				/*if (value.labelNodes !== undefined) {
					label = [];
					for (var i = 0; i < value.labelNodes.length; i++) {
						label.push(value.labelNodes[i].literalLabel.val);
					}
				}//*/
				/*if (label !== undefined && label instanceof Array && label.length !== undefined && label.length > 0) {
					var contained = false;
					for (var i = 0; i < label.length; i++) {
						if (label[i].toLowerCase().indexOf(query) != -1) {
							contained = true;
							break;
						}
					}
					if (contained)
						result.push(value);
				} else //*/if (label !== undefined && label.toLowerCase().indexOf(query) != -1) 
					result.push(value);
			});
			return result;
		}
	};
});

dbpv.filter("predicateFilter", function() {
	return function(input, query) {
		if(!query) return input;
		query = query.toLowerCase();
		var result = {};
		angular.forEach(input, function(predicate) {
			var label = predicate.lex.toLowerCase();
			if (label.indexOf(query) != -1) {
				result[predicate.predid]=predicate;
			} /*else if (predicate.uri.toLowerCase().indexOf(query) != -1) {
				result.push(predicate);
			}*/
		});
		return result;
	};
});

dbpv.filter("predicateValueFilter", function() { //XXX maybe merge with previous filter
	return function(input, query) {
		if (!query) {
			return input;
		}
		query = query.toLowerCase();
		var result = {};
		angular.forEach(input, function(predicate) {
			var hasvalues = false;
			for (var i = 0; i<predicate.values.length; i++) {	//simulates value filter
				var label = predicate.values[i].lex;
				if (label === undefined && predicate.values[i].literalLabel !== undefined) {
					label = predicate.values[i].literalLabel.lex;
				}
				if (label !== undefined && label.toLowerCase().indexOf(query) != -1) {
					hasvalues = true;
				}//*/
				
				
				/*var value = predicate.values[i];
				var label = value.lex;
				if (label === undefined && value.literalLabel !== undefined) {
					label = value.literalLabel.lex;
				}
				if (value.labelNodes !== undefined) {
					label = [];
					for (var i = 0; i < value.labelNodes.length; i++) {
						label.push(value.labelNodes[i].literalLabel.val);
					}
				}
				if (label !== undefined && label instanceof Array && label.length !== undefined && label.length > 0) {
					var contained = false;
					for (var i = 0; i < label.length; i++) {
						if (label[i].toLowerCase().indexOf(query) != -1) {
							contained = true;
							break;
						}
					}
					if (contained)
						hasvalues = true;
				} else if (label !== undefined && label.toLowerCase().indexOf(query) != -1) 
					hasvalues = true;
					//*/
			}
			if (hasvalues) {
				result[predicate.predid] = predicate;
			}
		});
		return result;
	};
});

dbpv.filter("languageFilter", function() {
	return function(input, primary, fallback) {
		if(input && (!primary || !fallback || input.length<2)) {
			//console.log("primary: "+primary+", fallback"+fallback);
			// TODO dirty hack
			//primary = angular.element($("body")).scope().primarylang;
			//fallback = angular.element($("body")).scope().fallbacklang;
			//return input;
		}//else{
		if	(input === undefined || input.length<2) {
			return input;
		} else {
			var result = [];
			//result.push(input[0]);
			var breek = false;
			var primarylanga = false;
			angular.forEach(input, function(predval) {
				if (!breek){
					if (predval.uri !== undefined) {
						result.push(predval);
					} else if (predval.literalLabel !== undefined) {
						if (predval.literalLabel.lang == "en") {
							//alert(JSON.stringify(predval) + "\n\n" + fallback);
						}
						if (predval.literalLabel.lang === undefined || predval.literalLabel.lang == "") {
							result.push(predval);
						} else {
							if (predval.literalLabel.lang == primary) {
								if (!primarylanga) {
									for (var i = 0; i<result.length; i++) {
										var res = result[i];
										if (res.literalLabel !== undefined && res.literalLabel.lang !== undefined && res.literalLabel.lang != primary) {
											result.splice(i, 1);
											i--;
										}
									}
								}
								result.push(predval);
								primarylanga = true;
								//console.log(JSON.stringify(predval) + " :: "+primary+" : "+fallback+" : "+predval.literalLabel.lang);
								//breek = true;
							}else if (result.length == 0 && predval.literalLabel.lang == fallback && !primarylanga) {
								result.push(predval);
								//console.log(fallback+" : "+predval.literalLabel.lang);
							} else {
								//console.log(primary+" : "+fallback+" : "+predval.literalLabel.lang);
							}
						}
					}
				}
			});
			return result;
		};
	};
});

dbpv.filter("actionFilter", function() {
	return function(actions, about, pred, val) {
		if(!pred || !val) return [];
		var result = [];
		angular.forEach(actions, function(action) {
			if (action.autobind !== undefined && action.autobind(about, pred, val)) {
				result.push(action);
			}
		});
		return result;
	};
});

dbpv.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

dbpv.directive('displayPredicates', function() {
	return {
		restrict:	"EA",
		replace:	false,
		transclude:	false,
		scope:		{
						about:		"=",
						primarylang:	"=",
						fallbacklang:	"="
					},
		template:	'<div class="top-block"> '+
						'<div id="triples-top">'+
							'<div class="predicate"> '+
								'<div class="pred-name form-inline"> '+
									'<label class="dbpv-tabletop"> Property:'+
									'</label> '+
									'<span predicate-filter predfilter="predfilter">'+
									'</span>'+
								'</div>'+
								'<div class="pred-values">		'+
									'<div class="pred-value form-inline"> '+
									'	<label class="dbpv-tabletop"> Value: '+
									'	</label> '+
									'	<span value-filter valfilter="valfilter">'+
									'	</span>'+
									'</div>	'+
					'			</div>	'+
					'		</div>'+
					'	</div>'+
					'	<div class="predicate" ng-repeat="(id, predicate) in predicates | predicateFilter:predfilter | predicateValueFilter:valfilter | orderBy:sortPredicates">'+
					'		<div ng-switch on="predicate.forward">'+
					'			<div ng-switch-when="true">'+
					'				<div display-predicate about="about" predicate="predicate" valfilter="valfilter" primarylang="primarylang" fallbacklang="fallbacklang">'+
					'				</div>'+
					'			</div>'+
					'			<div ng-switch-default>'+
									'<div display-reverse-predicate about="about" predicate="predicate" '+
									'valfilter="valfilter"'+
'									primarylang="primarylang" fallbacklang="fallbacklang">' +
									'</div>'+
					'			</div>'+
					'		</div>'+
					'	</div>'+
					'</div>',
		
		controller:	'DisplayPredicatesCtrl'			
	};
})

	.controller('DisplayPredicatesCtrl', ['$scope', '$timeout', '$filter', 'Entity', 'TafService', '$rootScope', function($scope, $timeout, $filter, Entity, TafService, $rootScope) {		
		$scope.sortPredicates = function(item) {
			return item.predid;
		};
		
		$scope.predicates = {};
		
		$rootScope.entitySemaphore ++;
		Entity.triples($scope.about.uri, $scope.predicates)
			.then(
				function(result) {
					//jQuery.extend($scope.predicates, predicates);
					TafService.onPredicateChange($scope.about, $scope.predicates);
					$rootScope.entitySemaphore --;
				},
				function(error) {
					$rootScope.entitySemaphore --;
				},
				function(update) {
				
				}
			)
		;
		
		$scope.reversepredicates = {};
		
		
		
		$rootScope.entitySemaphore ++;
		Entity.reversePredicates($scope.about.uri, $scope.reversepredicates)
			.then(
				function(result) {
					TafService.onPredicateChange($scope.about, $scope.reversepredicates);
					jQuery.extend($scope.predicates, $scope.reversepredicates);
					$rootScope.entitySemaphore --;
				},
				function(error) {
					$rootScope.entitySemaphore --;
				},
				function(update) {
				
				}
			)
		;
	}])
;

dbpv.directive('displayPredicate', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
						about:		"=",
						predicate:	"=",
						valfilter:	"=",
						primarylang:"=",
						fallbacklang:"="
					},
		template:	'<div><div class="pred-name"><span display-node node="predicate" primarylang="primarylang" fallbacklang="fallbacklang"></span></div><div display-node-values about="about" predicate="predicate" values="predicate.values" valfilter="valfilter" primarylang="primarylang" fallbacklang="fallbacklang"></div></div>'
	};
})

;

dbpv.directive('displayReversePredicate', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
						about:		"=",
						predicate:	"=",
						valfilter:	"=",
						primarylang:"=",
						fallbacklang:"="						
					},
		template:	'<div><div class="pred-name"><span display-node node="predicate" primarylang="primarylang" fallbacklang="fallbacklang"></span></div><div display-reverse-node-values about="about" predicate="predicate" values="predicate.values" valfilter="valfilter" primarylang="primarylang" fallbacklang="fallbacklang"></div></div>'
	}
})

;

dbpv.directive('displayNodeValues', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
						about:		"=",
						predicate:	"=",
						values:		"=",
						valfilter:	"=",
						primarylang:	"=",
						fallbacklang:	"="
					},
		template:	'<div class="pred-values"><div class="pred-value" ng-repeat="val in vals | orderBy:sortValues" ng-show="val.show"><span triple-actions="val.taf" about="about" predicate="predicate" value="val"></span> <span display-node node="val" primarylang="primarylang" fallbacklang="fallbacklang"></span></div><div ng-show="showButton"><button class="btn btn-block btn-primary btn-small btn-show-more dbpv-btn" ng-click="onShowAll()">Show All</button></div></div>',
		
		controller:	'DisplayNodeValuesCtrl'
		
	};
})

.controller('DisplayNodeValuesCtrl', ['$scope', '$filter', function($scope, $filter) {
		$scope.DisplayNodeValuesCtrl = true;
		var max = 10;
		var lim = 5;
		
		if ($scope.predicate.uri == "http://www.georss.org/georss/point") {
			console.log("GEORSS found");
		}
		
		$scope.moreOrLess = function() {
			if ($scope.showMore) {
				$scope.showAll();
			} else {
				$scope.showLess();
			}
		};
		
		$scope.showLess = function() {
			if ($scope.vals.length > max) {
				for (var i = 0; i < $scope.vals.length; i++) {
					if (i<lim) {
						$scope.vals[i].show = true;
					} else {
						$scope.vals[i].show = false;
					}
				}
				$scope.showButton = true;
			} else {
				for (var i = 0; i < $scope.vals.length; i++) {
					$scope.vals[i].show = true;
				}
				$scope.showButton = false;
			}
		};
		
		$scope.onShowAll = function() {
			$scope.showMore = true;
			$scope.moreOrLess();
		};
		
		$scope.showAll = function() {
			for (var i = 0; i < $scope.vals.length; i++) {
				$scope.vals[i].show = true;
			}
			$scope.showButton = false;
		};//*/
		
		$scope.$watch('valfilter+primarylang+fallbacklang', function(f) {
			$scope.applyFilters();
			$scope.moreOrLess();
		});
		
		$scope.applyFilters = function() {
			$scope.vals = $filter('valueFilter')($scope.values, $scope.valfilter);
			$scope.vals = $filter('languageFilter')($scope.vals, $scope.primarylang, $scope.fallbacklang);
		};
		
		$scope.showMore = false;
		$scope.showButton = false;
		$scope.applyFilters();
		$scope.moreOrLess();
		
		$scope.sortValues = function (item) {
			if (item.prefix !== undefined) {
				return item.prefix+item.short;
			}else{
				return item.label;
			}
		};
		
	}]);

;

dbpv.directive('dbpvPagination', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
						page:	"=",
						total:	"=",
						perpage:	"=",
						onSelect:	"&"
					},
		template:	'<div class="dbpv-paginator" ng-show="showPaginator">'+
					'	<div ng-show="showLeftNav">'+
					'		<button class="btn btn-block-primary btn-small btn-show-left dbpv-btn" ng-click="onShowLeft()">'+
								'PREVIOUS'+
					'		</button>'+
					'	</div>'+
					'	<div ng-show="!showLeftNav">'+
					'		<div class="btn-show-left-placeholder">'+
								'PREVIOUS'+
					'		</div>'+
					'	</div>'+
					'	<div ng-show="showPaginator">'+
						'	<div class="rev-paginator">PAGE: '+
						'		<input class="form-control dbpv-input dbpv-filter rev-paginator-page" ng-model="pagedis" ng-enter="changePage()"/>/{{pages+1}} '+
						'		<button class="btn dbpv-btn btn-block-primary btn-small" ng-click="changePage()">'+
									'GO'+
						'		</button>'+
						'	</div>'+
						'</div>'+
						'<div ng-show="showRightNav">'+
							'<button class="btn btn-block-primary btn-small btn-show-right dbpv-btn" ng-click="onShowRight()">'+
								'NEXT'+
					'		</button>'+
					'	</div>'+
					'	<div ng-show="!showRightNav">'+
					'		<div class="btn-show-right-placeholder">'+
								'NEXT'+
					'		</div>'+
					'	</div>'+
					'</div>',
		controller:	'DbpvPaginationCtrl'
	};
})

	.controller('DbpvPaginationCtrl', ['$scope', function($scope) {
		$scope.init = function() {
			$scope.pages = Math.floor($scope.total/$scope.perpage);
		}
		
		$scope.$watch('page', function(page) {
				$scope.pagedis = $scope.page + 1;
		});
		
		/*$scope.$watch('pagedis', function(pagedis) {
			if (pagedis.length > 0)
			$scope.page = pagedis - 1;
		});
		//*/
		
		$scope.$watch('total', function(total) {
			$scope.init();
			$scope.checkVisibility();
		});
		
		$scope.onShowRight = function() {
			var newpage = $scope.page + 1;
			if (newpage <= $scope.pages) {
				$scope.page = newpage;
				$scope.onPageChange();
			}
		};
		
		$scope.onShowLeft = function() {
			var newpage = $scope.page - 1;
			if (newpage >= 0) {
				$scope.page = newpage;
				$scope.onPageChange();
			}
		};
		
		$scope.changePage = function() {
			$scope.page = $scope.pagedis-1;
			if ($scope.page > $scope.pages) {
				$scope.page = $scope.pages;
			} else if ($scope.page < 0) {
				$scope.page = 0;
			}
			$scope.onPageChange();
		};
		
		$scope.onPageChange = function() {
			$scope.checkVisibility();
			$scope.onSelect($scope.page);
		};
		
		$scope.checkVisibility = function() {
			if ($scope.total > 0 && $scope.perpage <= $scope.total) {
				$scope.showPaginator = true;
				$scope.showRightNav = true;
				$scope.showLeftNav = true;
			}
			if ($scope.page == $scope.pages) {
				$scope.showRightNav = false;
			}
			if ($scope.page == 0) {
				$scope.showLeftNav = false;
			}
		};
		
		$scope.init();
		$scope.checkVisibility();
		
	}])

;


dbpv.directive('displayReverseNodeValues', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
						about:		"=",
						predicate:	"=",
						values:		"=",
						valfilter:	"=",
						primarylang:	"=",
						fallbacklang:	"="
					},
		template:	'<div class="pred-values"><div class="pred-value" ng-repeat="val in vals | orderBy:sortValues" ng-show="val.show"><span triple-actions="val.taf" about="about" predicate="predicate" value="val"></span> <span display-node node="val" primarylang="primarylang" fallbacklang="fallbacklang"></span></div>'+
		'<div ng-show="!predicate.reverseloaded.loaded"><button class="btn btn-block btn-primary btn-small btn-show-more dbpv-btn" ng-click="onLoadButton()">LOAD</button></div><div dbpv-pagination page="predicate.reverseloaded.page" total="predicate.reverseloaded.count" perpage="limit" on-select="onPageSelect(newpage)"></div></div>',
		
		controller:	'DisplayReverseNodeValuesCtrl'
		
	};
})

.controller('DisplayReverseNodeValuesCtrl', ['$scope', '$filter', 'Entity', 'TafService', function($scope, $filter, Entity, TafService) {
		var max = 10;
		var lim = 5;
		$scope.limit = 10;
		$scope.offset = 0;
		if (!$scope.predicate.reverseloaded) {
			var pred = $scope.predicate.reverseloaded = {};
			pred.count = 0;
			pred.page = 0;
			pred.table = {};
			pred.loaded = false;
		}
		
		/*$scope.vals = ($scope.predicate.reverseloaded && $scope.predicate.reverseloaded.vals? $scope.predicate.reverseloaded.vals: []);
		$scope.count = ($scope.predicate.reverseloaded && $scope.predicate.reverseloaded.count? $scope.predicate.reverseloaded.count: 0);
		$scope.showButtonLoad = !$scope.predicate.reverseloaded.loaded;
		
		$scope.page = ($scope.predicate.reverseloaded && $scope.predicate.reverseloaded.page? $scope.predicate.reverseloaded.page: 0);
		//*/
		
		$scope.onPageSelect = function(newpage) {
			
		};
		
		$scope.$watch('predicate.reverseloaded.page', function(page) {
				$scope.offset = page*$scope.limit;
				$scope.onLoad();
		});
		
		$scope.onLoadButton = function() {
			$scope.predicate.reverseloaded.loaded = true;
			$scope.onLoad();
		};
		
		$scope.loadCounts = function() {
			if ($scope.predicate.reverseloaded.loaded && $scope.predicate.reverseloaded.count < 1) {
				Entity.loadReverseValuesCount($scope.about, $scope.predicate)
					.then(
						function(results) {
							$scope.predicate.reverseloaded.count = results[0].literalLabel.val;
						}
					)
				;
			}
		};
		
		$scope.getLoaded = function() {
			var loadedresults = [];
			var i = $scope.offset;
			while (i < $scope.offset+$scope.limit) {
				var loadedvalue = $scope.predicate.reverseloaded.table[i];
				if (loadedvalue) {
					loadedresults.push(loadedvalue);
				}
				i++;
			}
			return loadedresults;
		};
		
		$scope.onLoad = function() {
			if ($scope.predicate.reverseloaded.loaded) {
				$scope.loadCounts();
				if ($scope.getLoaded().length == 0) {
					var offset = $scope.offset;
					var limit = $scope.limit;
					Entity.loadReverseValues($scope.about, $scope.predicate, limit, offset)
						.then(
							function(results) {
								$scope.showButtonLoad = false;
								for (var i = 0; i < results.length; i++) {
									if (!$scope.predicate.reverseloaded.table[i+offset]) {
										var resultentry = results[i];
										$scope.values.push(resultentry);
										resultentry.show = true;
										$scope.predicate.reverseloaded.table[i+offset] = resultentry;
									}
								}
								TafService.bindTafPredicate($scope.about, $scope.predicate);
								$scope.applyFilters();
								/*$scope.vals = results;
								$scope.predicate.reverseloaded.vals = $scope.vals;
								for (var i = 0; i < Math.min($scope.limit, results.length); i++) {
									$scope.values.push(results[i]);
									results[i].show = true;
								}
								TafService.bindTafPredicate($scope.about, $scope.predicate);
								$scope.applyFilters();
								//*/
							},
							function(error) {
							
							},
							function(update) {
							
							}
						)
					;
				} else {
					$scope.applyFilters();
				}
			}
		};

		$scope.$watch('valfilter+primarylang+fallbacklang', function(f) {
			$scope.applyFilters();
		});
		
		$scope.applyFilters = function() {
			$scope.vals = $scope.getLoaded();
			$scope.vals = $filter('valueFilter')($scope.vals, $scope.valfilter);
			$scope.vals = $filter('languageFilter')($scope.vals, $scope.primarylang, $scope.fallbacklang);
		};
		
		$scope.applyFilters();
		
		$scope.sortValues = function (item) {
			if (item.prefix !== undefined) {
				return item.prefix+item.short;
			}else{
				return item.label;
			}
		};
		
	}]);

;

dbpv.directive('displayNode', function() {
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
				if ($scope.node.labelNodes && $rootScope.showLabels) {
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

dbpv.directive('predicateFilter', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		template:	'<input class="form-control dbpv-input dbpv-filter dbpv-filter-pred" ng-model="predfilter" data-intro="Filter predicates using a string." data-step="4"/>',
		scope:		{
						predfilter:	"="
					}/*,
		controller:	'PredicateFilterController'*/
	};
})
/*	.controller('PredicateFilterController', ['$scope', '$timeout', function($scope, $timeout) {
		//$scope.currentpromise = null;
		$scope.$watch('predfil', function(predfil) {
			$scope.predfilter = $scope.predfil;
			/*if ($scope.currentpromise !== null) {
				$timeout.cancel($scope.currentpromise);
			}
			$scope.currentpromise = $timeout($scope.update, 500);
		});
		/*
		$scope.update = function() {
			//alert("update predfilter");
			$scope.predfilter = $scope.predfil;
		};
	}
])*/
;

dbpv.directive('valueFilter', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		template:	'<input class="form-control dbpv-input dbpv-filter dbpv-filter-val" ng-model="valfilter" data-intro="Filter values using a string." data-step="5"/>',
		scope:		{
						valfilter:	"="
					}/*,
		controller:	'ValueFilterController'*/
	};
})
/*	.controller('ValueFilterController', ['$scope', '$timeout', function($scope, $timeout) {
		$scope.currentpromise = null;
		$scope.prevpromise = null;
		
		$scope.update = function() {
			//alert("update predfilter");
			$scope.valfilter = $scope.valfil;
			$scope.$apply();
		};
		
		$scope.$watch('valfil', function(predfil) {
			//$scope.valfilter = $scope.valfil;
			$scope.prevpromise = $scope.currentpromise;
			$scope.currentpromise = $timeout(function() {
				$scope.valfilter = $scope.valfil;
			}, 500);
			if ($scope.prevpromise !== null) {
				$timeout.cancel($scope.prevpromise);
			}
		});
		
		$scope.$watch('valfilter', function(valfilter) {
			$scope.valfil = valfilter;
		});
	}
])
*/
;

dbpv.directive('compile', function($compile) {
	return function(scope, element, attrs) {
		scope.$watch(
			function(scope) {
				return scope.$eval(attrs.compile);
			},
			function(value) {
				element.html(value);
				$compile(element.contents())(scope);
			}
		);
	};
});
/*
dbpv.directive('dbpvPreview', function($timeout) {
	return function(scope, element, attrs) {
		//alert(JSON.stringify(attrs));
		var to = undefined;
		element.bind('mouseenter', function () {
			to = $timeout(function() {
				var parent = element;
				var position = parent.offset();
//alert(JSON.stringify(position));
				position.top = position.top + parent.height();
				to = undefined;
				var url = attrs.dbpvPreview;
				url = removeLocalPrefix(url);
				scope.entityPreview(url, position.top, position.left);
				scope.previewItemHover();
			}, 800);
		});
		element.bind('mouseleave', function () {
			if(to) $timeout.cancel(to);
			scope.previewItemUnhover();
		});
	};
});
//*/
dbpv.directive('labelList', function(Preview, $filter, $compile) {
	return {
		link: function(scope, element, attrs) {
			var rurl = attrs.labelList;
			if (rurl.substr(0, scope.owlgraph.length) == scope.owlgraph) rurl = rurl.substr(scope.owlgraph.length);
			
			rurl = removeLocalPrefix(rurl);
			scope.labellist = Preview.getProperty(rurl, "http://www.w3.org/2000/01/rdf-schema#label", {"count":0}, scope.owlgraph, scope.owlendpoint);

			scope.updateLabellist = function (list) {
				element.html("<a dbpv-preview href='"+attrs.labelList+"'>"+$filter("languageFilter")(list, scope.primarylang, scope.fallbacklang)[0].label+"</a>");
				$compile(element.contents())(scope);
			};

			scope.$watch("labellist", function (list) {
				scope.updateLabellist(list);
			}, true);
			scope.$watch("primarylang", function (list) {
				scope.updateLabellist(scope.labellist);
			});
		}
	};
});

dbpv.directive('sameOffset', function () {
	return {
		link:	function (scope, element, attrs) {
			var idToWatch = attrs.sameOffset;
			scope.$watch(
				function () {
					return angular.element(idToWatch).offset().top;
				},
				function (top) {
					element.css("top", top);
					//element.attr("smartscrollinit", top);
				}
			);
		}
	};
});

dbpv.directive('shortcut', function ($compile, UrlService) {
	return {
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
});

dbpv.directive('stupidScroll', function($window) {
	return {
		link:	function (scope, element, attrs) {
					/*$(window).scroll (function() {
						if ($(window).scrollTop() > attrs.stupidScroll) {
							element.offset({"top":$(window).scrollTop(), "left": 0});
						}
					});*/
				}
	};
});

dbpv.directive('smartScroll', function ($window) {
	return {
		link:	function (scope, element, attrs) {
				var prevset = 0;
				var inittop = 0;
				var scrolled = false;
				var inittop = attrs.smartScroll;
				if (inittop !== undefined) element.offset({"top": inittop, 'left':element.offset().left});
				//alert(JSON.stringify(element.offset()));
				$(window).scroll (function () {
					if (inittop === undefined) inittop = attrs.smartScroll;
					if (inittop === undefined) inittop = element.attr("smartscrollinit");
					if (inittop === undefined) inittop = 0;
					var down = $(window).scrollTop() > prevset;
					prevset = $(window).scrollTop();

					var winh = $(window).height();
					var wins = $(window).scrollTop();
					var eleh = element.height();
					var eles = element.offset().top;
					var elel = element.offset().left;
					// distance top of element -> top of window
					var eletopmar = wins-eles;
					// distance bottom of window -> bottom element
					var elebotmar = eles+eleh-wins-winh;

					var cantop = wins;
					
					if (eleh > winh) {
						if (down) {
							if (eletopmar > 0) {
								var canelebotmar = elebotmar + eletopmar;
								if (elebotmar < 0) {
									cantop = wins - canelebotmar;
								}else{
									cantop = undefined;
								}						
							}
						}else{
							console.log(eletopmar);
							if (eletopmar < 0) {
								cantop = wins;
							} else {
								cantop = undefined;
							}
						}
					}
					if (cantop !== undefined) {
						if (cantop > inittop) {
							element.offset({"top":cantop, "left": elel});
						}else{
							element.offset({"top":inittop, "left": elel});
						}
					}
				});
			}
		};
});

dbpv.directive('dbpvTop', function ($compile) {
	return {
		link:	function (scope, element, attrs) {
				scope.goHome = function() {
					$('body,html').animate({scrollTop: 0}, 800);
					return false;
				}
				element.html("<a href='javascript:void(0);' ng-click='goHome();'><span class='glyphicon glyphicon-chevron-up'></span></a>");
				$compile(element.contents())(scope);
				
				if ($(window).scrollTop() < 150) {
					element.css("visibility","hidden");
				}

				$(window).scroll( function () {
					if ($(window).scrollTop() > 150) {
						element.css("visibility","visible");
					}else{
						element.css("visibility","hidden");
					}

				});
			}
		};
});

dbpv.directive('smartSlide', function () {
	return {
		link: 	function (scope, element, attrs) {
					var root = attrs.id;
					var original = $("#"+root+" "+attrs.smartSlideContent).css("right");
					$("#"+root+" "+attrs.smartSlideContent).hide();
					$("#"+root+" "+attrs.smartSlide).click( function() {
						var a = $("#"+root+" "+attrs.smartSlideContent).css("right");
						var a = a.substr(0, a.length-2);
						if ( a < 0) {
							$("#"+root+" "+attrs.smartSlideContent).show();
							$("#"+root+" "+attrs.smartSlideContent).animate({
								right: "0px"
							}, 200);
						} else {
							$("#"+root+" "+attrs.smartSlideContent).animate({
								right: original
							}, 200, function() {$("#"+root+" "+attrs.smartSlideContent).hide();});
						}
					});
				}
	};
});

// PRETTY BOX DIRECTIVES

dbpv.directive('prettyTypes', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						types:			"=",
						primarylang:	"=",
						fallbacklang:	"=",
						owlgraph:		"=",
						owlendpoint:	"="
					},
		template:	'<div id="dbpvptypes" ng-show="types.length>0"><span class="dbpvptype" ng-repeat="type in types"><span pretty-type node="type" primarylang="primarylang" fallbacklang="fallbacklang" owlgraph="owlgraph" owlendpoint="owlendpoint"></span><span class="comma">, </span></span></div>',
		
		controller:	'PrettyTypesCtrl'
	};
})

	.controller('PrettyTypesCtrl', ['$scope', function($scope) {
		$scope.$watch('types', function(types) {
			console.log("types changed");
		},true);
	}])

;

dbpv.directive('prettyType', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	false,
		scope:		{
						node:			"=",
						primarylang:	"=",
						fallbacklang:	"=",
						owlgraph:		"=",
						owlendpoint:	"="
					},
		//template:	'<span compile={{type.uri}}>{{typestring}}</span>'
		//template:	'<span compile="nodedisplay"></span>',
		template:	'<span><a href="{{url}}" dbpv-preview>{{label}}</a></span>',
		controller:	'PrettyTypeCtrl'
	};
})

	.controller('PrettyTypeCtrl', ['$scope', '$filter', 'Preview', 'UrlService', function($scope, $filter, Preview, UrlService) {
		//$scope.$watch('node', function(node) {
			var local = false;
			var url = $scope.node.uri;
			$scope.label = $scope.node.uri;
			var prefshor = UrlService.prefixify($scope.node.uri);
			var urlobj = UrlService.makeUrl($scope.node.uri);
			url = urlobj.uri;
			var display = "";
			if (prefshor !== undefined && prefshor.length > 1) {
				$scope.url = url;
				if (true || urlobj.local) {
					$scope.label = prefshor[1];
					display = '<a href="'+url+'"'+' dbpv-preview>'+$scope.label+'</a>';
				} else {
					$scope.label = prefshor[0] + ":" + prefshor[1];
					display = '<a href="'+url+'">'+$scope.label+"</a>";
				}
				$scope.nodedisplay = display;
			}
			
			$scope.labellist = Preview.getProperty($scope.node.uri, "http://www.w3.org/2000/01/rdf-schema#label", $scope, "", $scope.owlendpoint);
			
			$scope.updateLabel = function (list) {
				var labl = $filter('languageFilter')(list, $scope.primarylang, $scope.fallbacklang)[0];
				if (labl !== undefined) {
					labl = labl.literalLabel.lex;
					$scope.label = labl;
				}
			};
			
			$scope.$watch('labellist', function (list) {
				$scope.updateLabel($scope.labellist); // WHY U NO UPDATE WHEN PREVIEW RESPONSE COMES IN???????
			}, true);
			$scope.$watch('primarylang', function(lang) {
				$scope.updateLabel($scope.labellist);
			});
		//});*/
	}])

;

dbpv.directive('prettyLinks', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						links:	"="
					},
		template:	'<div id="dbpvplinks">			<div ng-repeat="(label, list) in links" style="float:left;margin-right: 15px;">				<div ng-show="list.length>1" >					<a role="button" href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">{{label}} <span class="glyphicon glyphicon-chevron-down" style="font-size:0.6em;"></span></a>					<ul class="dropdown-menu">						<li ng-repeat="link in list"><a target="_blank" href="{{link.uri}}">{{link.plex}}</a></li>									</ul>				</div>				<div ng-show="list.length==1">					<a target="_blank" href="{{list[0].uri}}">{{list[0].plex}}</a>				</div>			</div>		</div>'
	};
});
//*/

dbpv.directive('prettyBox', function() {
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
		dbpv.applyPrettyBox = function(fn) {
			//$scope.$apply(
				fn($scope.dbpvp);
			//);
		}
		$scope.entitySemaphore = $rootScope.entitySemaphore;
		$scope.dbpvp = {};
		$scope.dbpvp.properties = [];
		
	}]);

;

dbpv.directive('dbpvpList', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						properties:	"=",
						primarylang:"=",
						fallbacklang:"="
					},
		template:	'<div id="dbpvpproperties" ng-show="showProperties()"><table id="dbpvplist"><tr ng-repeat="property in properties | orderBy:prioSort" class="propertyentry"><td class="propertykey">{{property.key}}:</td><td  class="propertyvalues"><div ng-repeat="value in property.values"><div display-node node="value" settings="displayset" class="propertyvalue" primarylang="primarylang" fallbacklang="fallbacklang"></div></div></div></td></tr></table></div>',
		controller:	'DbpvpListCtrl'
	}
})

	.controller('DbpvpListCtrl', ['$scope', function($scope) {
		$scope.showProperties = function() {
			return $scope.properties.length > 0;
		};
		
		$scope.displayset = {"noprefix":true};
		
		$scope.prioSort = function(property) {
			if (property && property.priority) {
				return property.priority;
			} else {
				return 0;
			}
		};
		
		dbpv.getPrettyPropertyAdder = function(key, priority) {
			if (key && key.length && key.length > 0) {
				var property = null;
				for (var i = 0; i < $scope.properties.length; i ++) {
					if ($scope.properties[i].key == key) {
						property = $scope.properties[i];
						break;
					}
				}
				if (! property) {
					property = {};
					property.key = key;
					property.values = [];
					$scope.properties.push(property);
				}
				if (property) {
					property.priority = priority;
					return function(value) {
						if (value) {
							property.values.push(value);
						}
					};
				}
			}
		};		
		
	}])

;

dbpv.directive('dbpvpMap', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		template:	'<div id="dbpvpmapcontainer" class="top-block"><div id="dbpvpmap"></div></div>',
		scope:		{
						/*lon:	"=",
						lat:	"="//*/
					},
		controller:	'DbpvpMapCtrl'
	};
})

	.controller('DbpvpMapCtrl', ['$scope', function($scope) {
	// OLD COORDINATES REMAIN !!!
	
		dbpv.setMapCoord = function(coord) {
			if ($scope.lon === undefined) {
				$scope.lon = coord[1];
				$scope.lat = coord[0];
				$scope.updateCoords();
			}
		};
		/*$scope.$watch('lon+lat', function(lon) {
			$scope.updateCoords();
		}, true);
		//*/
		$scope.updateCoords = function() {
			//$scope.coordLon = -90.0;
			//$scope.coordLat = 90.0;
			if ($scope.lon && $scope.lat) {
				$('#dbpvpmap').attr('class', 'dbpvpmap-active');
				if ($scope.mapview === undefined) {
					//$scope.mapview.remove();
					$scope.mapview = L.map('dbpvpmap');
					L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
						attribution: "<a href='http://osm.org/copyright'>&copy;</a>"
					}).addTo($scope.mapview);
					
				} else {
					
				}
				
				$scope.mapview.setView([$scope.lon, $scope.lat], 10);
				
				if ($scope.micon === undefined) {
					$scope.micon = L.icon({
						iconUrl: '/css/marker-icon.png',
						shadowUrl:	'/css/marker-shadow.png',
						iconSize:	[25, 41],
						shadowSize:	[41, 41],
						iconAnchor:	[13, 40],
						shadowAnchor: [13,40],
						popupAnchor:  [-3, -50]
					});
				}
				
				if ($scope.marker === undefined) {
					$scope.marker = L.marker([$scope.lon, $scope.lat], {icon: $scope.micon});
					$scope.marker.addTo($scope.mapview);
				} else {				
					$scope.marker.setLatLng([$scope.lon, $scope.lat]);
				}
				
				//TODO DOESN'T WORK WITH AUSTRALIA FOR SOME REASON !!!!!! goes east of japan ---> FIXED???? (dubbele GEORSS coords)
				//if ($scope.marker) alert("no marker");
			}/* else {
				$('#dbpvpmap').removeClass('dbpvpmap-active');
				if (typeof($scope.mapview) != "undefined") {
					$scope.mapview.remove();
				}
				console.log($scope.mapview);
			}//*/
		};
		/*$scope.lon = undefined;
		$scope.lat = undefined;
		$scope.updateCoords();//*/
	}]);

;
//*/

dbpv.directive('shortcutBox', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						/*shortcuts:	"="//*/
					},
		template:	'<div id="shortcutswrapper">						<div id="shortcuts" stupid-scroll="100" ng-show="shortcuts.length>0" style="top:100px;">							<div class="shortcut-home" dbpv-top></div>							<div class="shortcutscuts" data-intro="These are shortcuts to some basic entity properties." data-step="6">								<div class="shortcut" ng-repeat="cut in shortcuts">									<span shortcut="cut.url" shortcut-label="cut.label"></span>								</div>							</div>							<div class="shortcutscuts"></div>						</div>					</div>',
		controller:	"ShortcutBoxCtrl"
					
	};
})

	.controller('ShortcutBoxCtrl', ['$scope', function($scope) {
		$scope.shortcuts = [];
		dbpv.addShortcut = function(url, label, prio) {
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

;

dbpv.directive('dbpvPreview', function() {
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
			scope.previewSemaphore = 1;
			var mappings = dbpv.getConfig('previewMappings');
			for (var key in mappings) {
				if (dbpv[key] instanceof Array) {
					for (var subkey in mappings[key]) {
						dbpvp[key][subkey] = Preview.getProperty(node, mappings[key][subkey], scope, UrlService.localgraph, UrlService.endpoint);
					}
				} else {
					dbpvp[key] = Preview.getProperty(node, mappings[key], scope, UrlService.localgraph, UrlService.endpoint);
				}
			}
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
;

dbpv.directive('dbpvPreviewBox', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		template:	'<div ng-show="dbpvp.show" id="dbpvpreview" style="position:absolute;top:{{dbpvp.top}}px;left:{{dbpvp.left}}px;" ng-mouseenter="previewHover()" ng-mouseleave="previewUnhover()"><div id="dbpvpthumbnail">				<img ng-src="{{dbpvp.thumbnail[0].value}}"></img			</div><div id="dbpvptext">			<div id="dbpvplabel">				<span ng-repeat="value in dbpvp.label |languageFilter:primarylang:fallbacklang">					{{value.value}}				</span>			</div>			<div id="dbpvpdescription">				<span ng-repeat="value in dbpvp.description |languageFilter:primarylang:fallbacklang">					{{value.value}}				</span>			</div>			</div><div ng-repeat="(key, val) in dbpvp.properties">				<div id="dbpvpdescription">					<span ng-show="val.length>0">						{{key}}:						<a href="{{val.uri}}">							{{val.lex}}						</a>					</span>				</div>			</div>		</div>',
		scope:		{
						dbpvp:	"=",
						primarylang:	"=",
						fallbacklang:	"="
					}
	}
});
//*/

dbpv.directive('tripleActions', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		template:	'<span class="dbpv-taf"><span ng-repeat="action in taf"><span triple-action="action" value="value" predicate="predicate" about="about"></span></span>',
		scope:		{
						taf:	"=tripleActions",
						about:	"=",
						predicate:"=",
						value:	"="
					},
		controller:	'TripleActionsCtrl'
	};
})

	.controller('TripleActionsCtrl', ['$scope', function($scope) {
		if ($scope.taf !== undefined) {
			//alert("has actions");
		}
}]);

;

dbpv.directive('tripleAction', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						action:	"=tripleAction",
						about:	"=",
						predicate:"=",
						value:	"="
					},
		template:	'<span><a href="javascript:void(0);" title="{{action.description}}" ng-click="action.execute(about, predicate, value);"> <span ng-bind-html-unsafe="action.display();"></span> </a></span>'
	};
});

dbpv.directive('dbpvNotifications', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{},
		template:	'			<div id="notifications">				<div class="notification" ng-click="removeNotification(notification);" ng-repeat="notification in notifications">					<span class="text">{{notification.text}}</span>				</div>			</div>',
		controller:	'DbpvNotificationsCtrl'
	};
})

	.controller('DbpvNotificationsCtrl', ['$scope', '$timeout', function($scope, $timeout) {
		dbpv.addNotification = function (noti, time) {
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

dbpv.directive('dbpvLegend', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						
					},
		//template:	"<div>haha</div>",
		template:	'<div id="legend" smart-slide=".trigger" smart-slide-content=".container">	<div class="trigger" id="legend-title" data-intro="Here, the actions applicable to triples are explained." data-step="7" data-position="left"><a href="javascript:void(0);" ><span>LEGEND</span></a></div>	<div class="container" id="legends">		<div class="legend" ng-repeat="legend in legends">			<div class="name">{{legend.name}}</div>			<div class="description">{{legend.description}}</div>			<div class="line" ng-repeat="line in legend.lines">				<span ng-bind-html-unsafe="line.icon"></span> : {{line.text}}			</div>		</div>	</div></div>',//*/
		controller:	'DbpvLegendCtrl'
	};
})

	.controller('DbpvLegendCtrl', ['$scope', 'TafService', function($scope, TafService) {
		$scope.legends = [];
		
		$scope.addLegend = function(legend) {
			$scope.legends.push(legend);
		};
		$scope.actions = TafService.getActions();
		
		for (var i = 0; i < $scope.actions.length; i++) {
			var action = $scope.actions[i];
			if (typeof(action.legendize) != "undefined") {
				$scope.addLegend(action.legendize());
			}
		}//*/
	}])

;//*/

dbpv.directive('dbpvLookup', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace: 	true,
		controller:	'DbpvLookupCtrl',
		scope:		{
						localprefix:	"=",
						lookupgraph:	"=",
						lookupendpoint:	"="
					},
		template:	'<input data-intro="Search for entities. Powered by DBpedia Lookup." data-step="1" type="text" typeahead="result as result.l_label for result in lookup()" typeahead-wait-ms="800" typeahead-template-url="tpl/typeahead-custom.html" placeholder="Search..." class="form-control entity-search dbpv-input" ng-model="querie"/>'
	};
})

	.controller('DbpvLookupCtrl', ['$scope', '$http', '$timeout', 'Search', '$templateCache', function($scope, $http, $timeout, Search, $templateCache) {
		
		$templateCache.put("tpl/typeahead-custom.html", '<a><span bind-html-unsafe="match.label|typeaheadHighlight:query"></span><span class="typeahead-url"> ({{match.model.url}})</span></a>');
	
		var timer = false;
		var delay = 500;

		$scope.results = [];
		
		$scope.$watch('querie', function(querie) {
			if (querie === undefined || querie == "") {
				$scope.results = [];
			}else{
				if (querie.url !== undefined) {
					if (querie.url.substr(0, $scope.lookupgraph.length) == $scope.lookupgraph) {
						querie.url = querie.url.substr($scope.lookupgraph.length);
						if ($scope.localprefix !== undefined && $scope.localprefix != "") {
							window.location = $scope.localprefix+querie.url;
						} else {
							window.location = querie.url;
						}
					}
				}
			}
		});

		$scope.lookup = function() {
			
			if ($scope.querie === undefined || $scope.querie == "") {
				$scope.results = [];
			}else{
				return Search.search($scope.querie, 10).then(function(results) {
					var res = [];
					for (var i = 0; i < results.length; i++) {
						var result = results[i];
						var r = {"type": "uri", "l_label": result['label'].literalLabel.lex, "url": result["uri"].uri};
						res.push(r);
					}
					console.log(res);
					return res;
				});
			//*/
			
			/*  delete $http.defaults.headers.common['X-Requested-With'];
				//alert("returning promise");
				return $http.get($scope.lookupendpoint+"/PrefixSearch?MaxHits=5&QueryString="+$scope.query).then(function(data) {
					var results = data.data["results"];
					var res = [];
					for (var i = 0; i<results.length ; i++) {
						var result = results[i];
						var r = {"type": "uri", "l_label": result['label'], "url": result['uri']};
						res.push(r);
				//		console.log(r.l_label);
					}
					return res;
				});//*/
			}
		};
	}])

;

dbpv.directive('dbpvLanguageSwitch', function() {
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

	.controller('DbpvLanguageSwitchCtrl', ['$scope', function($scope) {
		if ($.cookie("dbpv_primary_lang") === undefined) {
			$.cookie("dbpv_primary_lang", $scope.primarylang, {expires:90, path: '/'});
		}
		$scope.primarylanguage = $.cookie("dbpv_primary_lang");

		$scope.availableLanguages = {};
		$scope.newAvailableLanguage = function (args) {
			$scope.availableLanguages[args] = $scope.languages[args];
		};
		
		dbpv.newAvailableLanguage = $scope.newAvailableLanguage;
		
		$scope.restLanguages = function() {
			var ret = {};
			for (var code in $scope.languages) {
				if (! (code in $scope.availableLanguages)) {
					ret[code] = $scope.languages[code];
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
				if (more) dbpv.addNotification("There are no values in the chosen language for this entity", 5000);
			}
			//$scope.$apply();
		});

		$scope.addNoti = function (text, timeout) {
			$scope.$broadcast("show notification", {"text":text, "timeout":timeout});
		};

		$scope.getNativeName = function(code) {
			return $scope.languages[code].nativeName;
		};

		$scope.selectLanguage = function(code) {
			$scope.primarylanguage = code;
		};
	}])

;

dbpv.directive('dbpvTopbar', function() {
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
					
		template:	'<div class="navbar top-block"> 		<div class="dbp-logo">			<img ng-src="{{logo}}"></img> 		</div> 		<div id="searchbar">	  			<div class="input-group" id="topstuff">				<span class="input-group-addon glyphicon glyphicon-search"></span>				<div dbpv-lookup lookupgraph="lookupgraph" lookupendpoint="lookupendpoint" localprefix="localprefix"></div> 				<span class="input-group-addon addon-right" title="This is the Named Graph">@ {{localgraph}}</span>				<div dbpv-language-switch primarylang="primarylang" languages="languages"></div>			</div>					</div> <div dbpv-settings></div></div>'
	};
})
;

dbpv.directive('dbpvSettings', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
		
					},
		template:	'<div id="dbpv-settings"><div ng-repeat="setting in settings"><div class="form-group" ng-switch="setting.type"><div ng-when="string"><label>{{setting.label}}</label><input type="text" class="form-control" ng-model="setting.value"/></div><div ng-when="boolean"><label><input type="checkbox" class="form-control" ng-model="setting.value"/>{{setting.label}}</label></div></div></div> </div>',
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
		
		$scope.makeSettings = function() {
			for (var i = 0; i < $scope.settingsmap.length; i++) {
				var setting = $scope.settingsmap[i];
				setting.value = $rootScope[setting.id];
				if (setting.prio > 0 && setting.value) {
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
			console.log(JSON.stringify($scope.settings));
		};
		
		$scope.makeSettings();
	}])

;

dbpv.directive('dbpvDisclaimer', function() {
	return {
		restrict:	"EA",
		replace:	true,
		scope:		{
						about:		"=",
						localgraph:	"="
					},
		controller:	'DbpvDisclaimerCtrl',
		template:	'<div id="ft_ccbysa" ng-show="disclaimed">	This content was extracted from <a href="http://www.wikipedia.org">Wikipedia</a> and is licensed under the <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>	</br>	The content on this page was created by the <a href="{{wikipage.history}}">editors of the Wikipedia page {{wikipage.title}}</a>.      </div>'
	};
})

	.controller('DbpvDisclaimerCtrl', ['$scope', function($scope) {
		console.log("disclaimer");
		$scope.suffix = "/resource/";
		$scope.disclaimed = false;
		
		dbpv.setFooterWikipage = function(settings) {
			$scope.wikipage = settings;
		};
		
		if ($scope.about.uri.indexOf($scope.localgraph + $scope.suffix) != -1) {
			$scope.about.title = $scope.about.uri.slice(($scope.localgraph+$scope.suffix).length, $scope.about.uri.length);
			$scope.about.datalink = "/data/"+($scope.about.title);
			$scope.disclaimed = true;
		} else {
		}
	}])

;


dbpv.directive('dbpvRelationInstances', function() {
	return {
		restrict:	"EA",
		replace:	true,
		scope:		{
						about:	"=",
						primarylang:	"=",
						fallbacklang:	"="
						
					},
		template:	'<div id="relation-instances" class="top-block" ng-show="showInstances"><div id="relation-instances-top">Some relation instances</div><div id="relation-instances"><div ng-repeat="instance in instances"><div class="relation-instance"><div class="relation-instance-subject"><div display-node node="instance.subj" primarylang="primarylang" fallbacklang="fallbacklang"></div></div><div class="relation-instance-object"><div display-node node="instance.obj" primarylang="primarylang" fallbacklang="fallbacklang"></div></div></div></div></div></div>',
		controller:	"DbpvRelationInstancesCtrl",
	};
})

	.controller('DbpvRelationInstancesCtrl', ['$scope', 'Entity', function($scope, Entity) {
		
		dbpv.showRelationInstances = function() {
			$scope.showInstances = true;
			console.log("getting instances");
			$scope.loadInstances(25);
		};
		
		$scope.loadInstances = function(number) {
			Entity.relationInstances($scope.about.uri, number)
				.then(
					function(instances) {
						$scope.instances = instances;
					}
				)
			;
		};
	}])
	
;


dbpv.directive('dbpvClassInstances', function() {
	return {
		restrict:	"EA",
		replace:	true,
		scope:		{
						about:	"=",
						primarylang:	"=",
						fallbacklang:	"="
						
					},
		template:	'<div id="class-instances" ng-show="showInstances">'+
		'<div id="facetblock"><div facet-tree sparql-service="sparqlService" facet-tree-config="facetTreeConfig" select="selectFacet(path)"></div>'+
		'<div facet-value-list sparql-service="sparqlService" facet-tree-config="facetTreeConfig" path="path"></div>	'+
		'<div constraint-list sparql-service="sparqlService" facet-tree-config="facetTreeConfig"></div></div>'+
		'<div id="instance-block" class="top-block"><div id="class-instances-top">Some instances of this class:</div><div id="class-instances"><div class="class-instance-i" dbpv-pagination page="page" total="total" perpage="perpage"></div><div ng-repeat="instance in instances"><div class="class-instance-i"><div class="class-instance"><div display-node node="instance" primarylang="primarylang" fallbacklang="fallbacklang"></div></div></div></div></div></div></div>',
		controller:	"DbpvClassInstancesCtrl",
	};
})

	.controller('DbpvClassInstancesCtrl', ['$scope', 'Entity', 'UrlService', function($scope, Entity, UrlService) {
	
		// faceted browsing code //
		var service = Jassa.service;
		var facete = Jassa.facete;
		
		var sparqlServiceFactory = new service.SparqlServiceFactoryDefault();

		$scope.sparqlService = new service.SparqlServiceHttp(UrlService.endpoint, UrlService.endpointgraph);
		
       // $scope.sparqlService = sparqlServiceFactory.createSparqlService(UrlService.endpoint, UrlService.endpointgraph);

        $scope.facetTreeConfig = new Jassa.facete.FacetTreeConfig();
		
		var baseVar = Jassa.rdf.NodeFactory.createVar('s');
		var classNode = Jassa.rdf.NodeFactory.createUri($scope.about.uri);
		var baseElement = new Jassa.sparql.ElementTriplesBlock([new Jassa.rdf.Triple(baseVar, Jassa.vocab.rdf.type, classNode)]);
		var baseConcept = new Jassa.facete.Concept(baseElement, baseVar);

		$scope.facetTreeConfig.getFacetConfig().setBaseConcept(baseConcept);

        $scope.path = null;

        $scope.selectFacet = function(path) {
            //alert('Selected Path: [' + path + ']');
            $scope.path = path;
        };
		
		// end faceted browsing code //
		
		
		$scope.showPaginator = true;
		
		$scope.perpage = 15;
		$scope.page = 0;
		$scope.total = 0;
		
		$scope.criteria = "?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+$scope.about.uri+">";
		
		$scope.getInstanceNumber = function() {
			if ($scope.showInstances) {
				Entity.loadReverseValuesCount($scope.about, {"uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"})
					.then(
						function(number) {
							$scope.total = number[0].literalLabel.val;
						}
					)
				;//*/
				/*Entity.loadFacetedCount($scope.criteria, $scope.perpage, $scope.offset).
					then(
						function(number) {
							$scope.total = number[0].literalLabel.val;
						}
					)
				;//*/
			}
		};
		
	
		dbpv.showClassInstances = function() {
			$scope.showInstances = true;
			$scope.getInstanceNumber();
		};
		
		$scope.loadInstances = function() {
			if ($scope.showInstances) {
				Entity.loadReverseValues($scope.about, {"uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"}, $scope.perpage, $scope.offset)
					.then(
						function(instances) {
							$scope.instances = instances;
						}
					)
				;
				//*/
				/*
				Entity.loadFaceted($scope.criteria, $scope.perpage, $scope.offset).
					then(
						function(instances) {
							$scope.instances = instances;
						}
					)
				;//*/
			}
		};
		
		$scope.$watch('page', function(page) {
			$scope.offset = $scope.page * $scope.perpage;
			$scope.loadInstances();
		});
		
		$scope.$watch('total', function(total) {
			$scope.loadInstances();
		});
	}])

;