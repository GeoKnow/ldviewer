/*
 * jassa-ui-angular
 * https://github.com/GeoKnow/Jassa-UI-Angular

 * Version: 0.0.1-SNAPSHOT - 2014-04-16
 * License: MIT
 */
angular.module("ui.jassa", ["ui.jassa.tpls", "ui.jassa.constraint-list","ui.jassa.facet-tree","ui.jassa.facet-value-list","ui.jassa.sparql-table","ui.jassa.template-list"]);
angular.module("ui.jassa.tpls", ["template/constraint-list/constraint-list.html","template/facet-tree/facet-dir-content.html","template/facet-tree/facet-dir-ctrl.html","template/facet-tree/facet-tree-item.html","template/facet-value-list/facet-value-list.html","template/sparql-table/sparql-table.html","template/template-list/template-list.html"]);
angular.module('ui.jassa.constraint-list', [])

.controller('ConstraintListCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

    var self = this;

    //var constraintManager;

    var updateConfig = function() {
        var isConfigured = $scope.facetTreeConfig;
        //debugger;
        $scope.constraintManager = isConfigured ? $scope.facetTreeConfig.getFacetConfig().getConstraintManager() : null;
    };
    
    var update = function() {
        updateConfig();
        self.refresh();
    };


    $scope.ObjectUtils = Jassa.util.ObjectUtils;

    var watchList = '[ObjectUtils.hashCode(sparqlService), ObjectUtils.hashCode(facetTreeConfig)]';
    $scope.$watch(watchList, function() {
		update();
	}, true);
    
    
    var renderConstraint = function(constraint) {
        var type = constraint.getName();

        var result;
        switch(type) {
        case 'equal':
            var pathStr = ''  + constraint.getDeclaredPath();
            if(pathStr === '') {
                pathStr = '()';
            }
            result = pathStr + ' = ' + constraint.getValue();
        break;
        default:
            result = constraint;
        }
        
        return result;
    };
    
    self.refresh = function() {

        var constraintManager = $scope.constraintManager;
        
        var items;
        if(!constraintManager) {
            items = [];
        }
        else {
            var constraints = constraintManager.getConstraints();
            
            items =_(constraints).map(function(constraint) {
                var r = {
                    constraint: constraint,
                    label: '' + renderConstraint(constraint)
                };
                
                return r;
            });
        }

        $scope.constraints = items;
    };
    
    $scope.removeConstraint = function(item) {
        $scope.constraintManager.removeConstraint(item.constraint);
        //$scope.$emit('facete:constraintsChanged');
    };
    
}])


/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig) 
 */
.directive('constraintList', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/constraint-list/constraint-list.html',
        transclude: false,
        require: 'constraintList',
        scope: {
            sparqlService: '=',
            facetTreeConfig: '=',
            onSelect: '&select'
        },
        controller: 'ConstraintListCtrl'
    };
})

;

angular.module('ui.jassa.facet-tree', [])

/**
 * Controller for the SPARQL based FacetTree
 * Supports nested incoming and outgoing properties
 *
 */
.controller('FacetTreeDirContentCtrl', ['$rootScope', '$scope', '$q', function($rootScope, $scope, $q) {

}])

/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig) 
 */
.directive('facetTreeDirContent', function($parse) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/facet-tree/facet-tree-content.html',
        transclude: false,
        require: 'facetTree',
        scope: {
            sparqlService: '=',
            facetTreeConfig: '=',
            plugins: '=',
            onSelect: '&select'
        },
        controller: 'FacetTreeDirContentCtrl',
        compile: function(elm, attrs) {
            return function link(scope, elm, attrs, controller) {
            };
        }
    };
})

;

angular.module('ui.jassa.facet-tree', ['ui.jassa.template-list'])

/**
 * Controller for the SPARQL based FacetTree
 * Supports nested incoming and outgoing properties
 *
 */
.controller('FacetTreeCtrl', ['$rootScope', '$scope', '$q', function($rootScope, $scope, $q) {
        
    var self = this;
      
      
    var updateFacetTreeService = function() {
        var isConfigured = $scope.sparqlService && $scope.facetTreeConfig;
        //debugger;
        $scope.facetTreeService = isConfigured ? Jassa.facete.FaceteUtils.createFacetTreeService($scope.sparqlService, $scope.facetTreeConfig, null) : null;
    };
    
    var update = function() {
        updateFacetTreeService();
        //controller.refresh();
        self.refresh();
    };
    
    
    $scope.setFacetHover = function(facet, isHovered) {
        facet.isHovered = isHovered;
        if(facet.incoming) {
            facet.incoming.isHovered = isHovered;
        }
        
        if(facet.outgoing) {
            facet.outgoing.isHovered = isHovered;
        }
    };

    $scope.ObjectUtils = Jassa.util.ObjectUtils;

    var watchList = '[ObjectUtils.hashCode(sparqlService), ObjectUtils.hashCode(facetTreeConfig)]';
    $scope.$watch(watchList, function() {
        update();
    }, true);
                  
      
    $scope.doFilter = function(path, filterString) {
        $scope.facetTreeConfig.getPathToFilterString().put(path, filterString);
        self.refresh();
    };
    
    self.refresh = function() {
                  
        var facet = $scope.facet;
        var startPath = facet ? facet.item.getPath() : new Jassa.facete.Path();
    
        if($scope.facetTreeService) {
          
            var facetTreeTagger = Jassa.facete.FaceteUtils.createFacetTreeTagger($scope.facetTreeConfig.getPathToFilterString());
    
            //console.log('scopefacets', $scope.facet);             
            var promise = $scope.facetTreeService.fetchFacetTree(startPath);
              
            Jassa.sponate.angular.bridgePromise(promise, $q.defer(), $rootScope).then(function(data) {
                facetTreeTagger.applyTags(data);
                $scope.facet = data;
            });
    
        } else {
            $scope.facet = null;
        }
    };
              
    $scope.toggleCollapsed = function(path) {
        Jassa.util.CollectionUtils.toggleItem($scope.facetTreeConfig.getExpansionSet(), path);
          
        var val = $scope.facetTreeConfig.getExpansionMap().get(path);
        if(val == null) {
            $scope.facetTreeConfig.getExpansionMap().put(path, 1);
        }
          
        self.refresh();
    };
      
    $scope.selectIncoming = function(path) {
        console.log('Incoming selected at path ' + path);
        if($scope.facetTreeConfig) {
            var val = $scope.facetTreeConfig.getExpansionMap().get(path);
            if(val != 2) {
                $scope.facetTreeConfig.getExpansionMap().put(path, 2);
                self.refresh();
            }
        }
    };
      
    $scope.selectOutgoing = function(path) {
        console.log('Outgoing selected at path ' + path);
        if($scope.facetTreeConfig) {
            var val = $scope.facetTreeConfig.getExpansionMap().get(path);
            if(val != 1) {
                $scope.facetTreeConfig.getExpansionMap().put(path, 1);
                self.refresh();
            }
        }
    };
      
      
    $scope.selectFacetPage = function(page, facet) {
        var path = facet.item.getPath();
        var state = $scope.facetTreeConfig.getFacetStateProvider().getFacetState(path);
        var resultRange = state.getResultRange();
          
        console.log('Facet state for path ' + path + ': ' + state);
            var limit = resultRange.getLimit() || 0;
              
            var newOffset = limit ? (page - 1) * limit : null;
              
            resultRange.setOffset(newOffset);
            
            self.refresh();
        };
          
        $scope.toggleSelected = function(path) {
            $scope.onSelect({path: path});
        };
  
        $scope.toggleTableLink = function(path) {
            //$scope.emit('facete:toggleTableLink');
        tableMod.togglePath(path);
      
        //$scope.$emit('')
        // alert('yay' + JSON.stringify(tableMod.getPaths()));
      
        $scope.$emit('facete:refresh');
      
//        var columnDefs = tableMod.getColumnDefs();
//        _(columnDefs).each(function(columnDef) {
          
//        });
      
//        tableMod.addColumnDef(null, new ns.ColumnDefPath(path));
      //alert('yay ' + path);
        };
      
  //  $scope.$on('facete:refresh', function() {
//        $scope.refresh();
  //  });
}])

/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig) 
 */
.directive('facetTree', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/facet-tree/facet-tree-item.html',
        transclude: false,
        require: 'facetTree',
        scope: {
            sparqlService: '=',
            facetTreeConfig: '=',
            plugins: '=',
            pluginContext: '=', //plugin context
            onSelect: '&select'
        },
        controller: 'FacetTreeCtrl',
        compile: function(elm, attrs) {
            return function link(scope, elm, attrs, controller) {
            };
        }
    };
})

;

angular.module('ui.jassa.facet-value-list', [])

/**
 * Controller for the SPARQL based FacetTree
 * Supports nested incoming and outgoing properties
 *
 */
.controller('FacetValueListCtrl', ['$rootScope', '$scope', '$q', function($rootScope, $scope, $q) {

    $scope.filterText = '';

    $scope.pagination = {
        totalItems: 0,
        currentPage: 1,
        maxSize: 5
    };
    
    //$scope.path = null;
    

    var facetValueService = null;
    
    var self = this;

    var ns = {};
    ns.FacetValueService = Class.create({
        initialize: function(sparqlService, facetTreeConfig) {
            this.sparqlService = sparqlService;
            this.facetTreeConfig = facetTreeConfig;
        },
      
        getFacetTreeConfig: function() {
            return this.facetTreeConfig;
        },
        
        createFacetValueFetcher: function(path, filterText) {

            var facetConfig = this.facetTreeConfig.getFacetConfig();

            var facetConceptGenerator = Jassa.facete.FaceteUtils.createFacetConceptGenerator(facetConfig);
            var concept = facetConceptGenerator.createConceptResources(path, true);
            var constraintTaggerFactory = new Jassa.facete.ConstraintTaggerFactory(facetConfig.getConstraintManager());
            
            var store = new Jassa.sponate.StoreFacade(this.sparqlService);
            var labelMap = Jassa.sponate.SponateUtils.createDefaultLabelMap();
            store.addMap(labelMap, 'labels');
            labelsStore = store.labels;
            
            var criteria = {};
            if(filterText) {
                criteria = {$or: [
                    {hiddenLabels: {$elemMatch: {id: {$regex: filterText, $options: 'i'}}}},
                    {id: {$regex: filterText, $options: 'i'}}
                ]};
            }
            var baseFlow = labelsStore.find(criteria).concept(concept, true);

            var result = new ns.FacetValueFetcher(baseFlow, this.facetTreeConfig, path);
            return result;
        }
    });

    
    ns.FacetValueFetcher = Class.create({
                
        initialize: function(baseFlow, facetTreeConfig, path) {
            this.baseFlow = baseFlow;
            this.facetTreeConfig = facetTreeConfig;
            this.path = path;
        },
        
        fetchCount: function() {
            var countPromise = this.baseFlow.count();
            return countPromise;
        },
        
        fetchData: function(offset, limit) {
            
            var dataFlow = this.baseFlow.skip(offset).limit(limit);

            var self = this;

            var dataPromise = dataFlow.asList(true).pipe(function(docs) {
                var path = self.path;
                
                var facetConfig = self.facetTreeConfig.getFacetConfig();
                var constraintTaggerFactory = new Jassa.facete.ConstraintTaggerFactory(facetConfig.getConstraintManager());
                
                var tagger = constraintTaggerFactory.createConstraintTagger(path);
                
                var r = _(docs).map(function(doc) {
                    // TODO Sponate must support retaining node objects
                    //var node = rdf.NodeFactory.parseRdfTerm(doc.id);
                    var node = doc.id;
                    
                    var label = doc.displayLabel ? doc.displayLabel : '' + doc.id;
                    //console.log('displayLabel', label);
                    var tmp = {
                        displayLabel: label,
                        path: path,
                        node: node,
                        tags: tagger.getTags(node)
                    };

                    return tmp;
                    
                });

                return r;
            });
            
            return dataPromise;
        }
    });

    var updateFacetTreeService = function() {
        var isConfigured = $scope.sparqlService && $scope.facetTreeConfig && $scope.path;

        facetValueService = isConfigured ? new ns.FacetValueService($scope.sparqlService, $scope.facetTreeConfig) : null;
    };
    
    var update = function() {
        updateFacetTreeService();
        self.refresh();
    };

    $scope.ObjectUtils = Jassa.util.ObjectUtils;

    var watchList = '[ObjectUtils.hashCode(sparqlService), ObjectUtils.hashCode(facetTreeConfig), "" + path, pagination.currentPage]';
    $scope.$watch(watchList, function() {
        update();
    }, true);
                  


    $scope.toggleConstraint = function(item) {
        var constraintManager = facetValueService.getFacetTreeConfig().getFacetConfig().getConstraintManager();
        
        var constraint = new Jassa.facete.ConstraintSpecPathValue(
                'equal',
                item.path,
                item.node);

        // TODO Integrate a toggle constraint method into the filterManager
        constraintManager.toggleConstraint(constraint);
    };
    
    
    
    self.refresh = function() {
        var path = $scope.path;
        
        if(!facetValueService || !path) {
            $scope.totalItems = 0;
            $scope.facetValues = [];
            return;
        }
        
        var fetcher = facetValueService.createFacetValueFetcher($scope.path, $scope.filterText);

        var countPromise = fetcher.fetchCount();
        
        var pageSize = 10;
        var offset = ($scope.pagination.currentPage - 1) * pageSize;
        
        var dataPromise = fetcher.fetchData(offset, pageSize);

        Jassa.sponate.angular.bridgePromise(countPromise, $q.defer(), $scope.$root, function(count) {
            $scope.pagination.totalItems = count;
        });
        
        Jassa.sponate.angular.bridgePromise(dataPromise, $q.defer(), $scope.$root, function(items) {
            $scope.facetValues = items;
        });

    };

    $scope.filterTable = function(filterText) {
        $scope.filterText = filterText;
        update();
    };

    
    /*
    $scope.$on('facete:facetSelected', function(ev, path) {

        $scope.currentPage = 1;
        $scope.path = path;
        
        updateItems();
    });
    
    $scope.$on('facete:constraintsChanged', function() {
        updateItems(); 
    });
    */
//  $scope.firstText = '<<';
//  $scope.previousText = '<';
//  $scope.nextText = '>';
//  $scope.lastText = '>>';

}])

/**
 * The actual dependencies are:
 * - sparqlServiceFactory
 * - facetTreeConfig
 * - labelMap (maybe this should be part of the facetTreeConfig) 
 */
.directive('facetValueList', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/facet-value-list/facet-value-list.html',
        transclude: false,
        require: 'facetValueList',
        scope: {
            sparqlService: '=',
            facetTreeConfig: '=',
            path: '=',
            onSelect: '&select'
        },
        controller: 'FacetValueListCtrl'
//        compile: function(elm, attrs) {
//            return function link(scope, elm, attrs, controller) {
//            };
//        }
    };
})

;

angular.module('ui.jassa.sparql-table', [])

.controller('SparqlTableCtrl', ['$scope', '$rootScope', '$q', function($scope, $rootScope, $q) {

    var rdf = Jassa.rdf;
    var sparql = Jassa.sparql;
    var service = Jassa.service;
    var util = Jassa.util;
    
    var sponate = Jassa.sponate;

    
    var syncTableMod = function(sortInfo, tableMod) {
        util.ArrayUtils.clear(tableMod.getSortConditions());
        
        
        for(var i = 0; i < sortInfo.fields.length; ++i) {
            var columnId = sortInfo.fields[i];
            var dir = sortInfo.directions[i];
            
            var d = 0;
            if(dir === 'asc') {
                d = 1;
            }
            else if(dir === 'desc') {
                d = -1;
            }
            
            if(d !== 0) {
                var sortCondition = new Jassa.facete.SortCondition(columnId, d);
                tableMod.getSortConditions().push(sortCondition);
            }
        }
    };

/*    
    var createQueryCountQuery = function(query, outputVar) {
        //TODO Deterimine whether a sub query is needed
        var result = new sparql.Query();
        var e = new sparql.ElementSubQuery(query);
        result.getElements().push(e);
        result.getProjectVars().add(outputVar, new sparql.E_Count());
        
        return result;
    };
*/

    var createNgGridOptionsFromQuery = function(query) {
        if(!query) {
            return [];
        }
        
        var projectVarList = query.getProjectVars().getVarList();
        var projectVarNameList = sparql.VarUtils.getVarNames(projectVarList);

        var result = _(projectVarNameList).map(function(varName) {
            var col = {
                field: varName,
                displayName: varName
            };
                
            return col;
        });
        
        return result;
    };
    

    

    service.SparqlTableService = Class.create({
        /**
         * TODO Possibly add primaryCountLimit - i.e. a limit that is never counted beyond, even if the backend might be fast enough
         */
        initialize: function(sparqlService, query, timeoutInMillis, secondaryCountLimit) {
            this.sparqlService = sparqlService;
            this.query = query;
            this.timeoutInMillis = timeoutInMillis || 3000;
            this.secondaryCountLimit = secondaryCountLimit || 1000;
        },
        
        fetchCount: function() {
            if(!this.query) {
                var deferred = jQuery.Deferred();
                deferred.resolve(0);
                return deferred.promise();
            }
            
            var query = this.query.clone();

            query.setLimit(null);
            query.setOffset(null);
  
            var result = service.ServiceUtils.fetchCountQuery(this.sparqlService, this.query, this.timeoutInMillis, this.secondaryCountLimit);
          
/*
            var countVar = rdf.NodeFactory.createVar('_c_');
            var countQuery = createQueryCountQuery(query, countVar);
            var countQe = this.sparqlService.createQueryExecution(countQuery);
            var promise = service.ServiceUtils.fetchInt(countQe, countVar);
*/
            
            //console.log('Count Query: ' + countQuery);

            //return promise;
            return result;
        },
        
        fetchData: function(limit, offset) {
            if(!this.query) {
                var deferred = jQuery.Deferred();

                var itBinding = new util.IteratorArray([]);
                var varNames = [];
                var rs = new ns.ResultSetArrayIteratorBinding(itBinding, varNames);
               
                
                deferred.resolve(rs);
                return deferred.promise();
            }

            
            var query = this.query.clone();

            query.setLimit(limit);
            query.setOffset(offset);
            
            var qe = this.sparqlService.createQueryExecution(query);

            var result = qe.execSelect().pipe(function(rs) {
                var data = [];
                
                var projectVarList = query.getProjectVars().getVarList();
                
                var makeJson = function(varList, binding) {
                    var result = {};
                    
                    _(varList).each(function(v) {
                        var varName = v.getName();
                        result[varName] = '' + binding.get(v);
                    });

                    return result;
                };
                
                while(rs.hasNext()) {
                    var binding = rs.next();
                    
                    var o = makeJson(projectVarList, binding);
                    
                    data.push(o);
                }
                
                return data;
            });
            
            return result;
        },
        
        getSchema: function() {
            var query = this.query;

            //var projectVarList = query.getProjectVars().getVarList();
            //var projectVarNameList = sparql.VarUtils.getVarNames(projectVarList);

            var colDefs = createNgGridOptionsFromQuery(query);
            
            
            return colDefs;
        }
    });

    
    var createTableService = function() {
        var config = $scope.config;
        
        var sparqlService = $scope.sparqlService;
        var queryFactory = config ? config.queryFactory : null;
        
        var query = queryFactory ? queryFactory.createQuery() : null;
        
        var result = new service.SparqlTableService(sparqlService, query);
        
        return result;
    };


    
    $scope.$watch('gridOptions.sortInfo', function(sortInfo) {
        var tableMod = $scope.config.tableMod;

        syncTableMod(sortInfo, tableMod);
        
        $scope.refreshData();
    }, true);


    $scope.$watch('[pagingOptions, filterOptions]', function (newVal, oldVal) {
        $scope.refreshData();
    }, true);
        
    $scope.ObjectUtils = util.ObjectUtils;
    
    $scope.$watch('[ObjectUtils.hashCode(sparqlService), ObjectUtils.hashCode(config)]', function (newVal, oldVal) {
        $scope.refresh();
    }, true);

    
    $scope.totalServerItems = 0;
        
    $scope.pagingOptions = {
        pageSizes: [10, 50, 100],
        pageSize: 10,
        currentPage: 1
    };

    $scope.refresh = function() {
        var tableService = createTableService();
        
        $scope.refreshSchema(tableService);
        $scope.refreshPageCount(tableService);
        $scope.refreshData(tableService);
    };

    $scope.refreshSchema = function(tableService) {
        tableService = tableService || createTableService();

        $scope.colDefs = tableService.getSchema();
    };

    $scope.refreshPageCount = function(tableService) {
        tableService = tableService || createTableService();
        
        var promise = tableService.fetchCount();

//        $q.when(promise).then(function(countInfo) {
//            $scope.totalServerItems = countInfo.count;
//        });
        
//        promise.done(function(countInfo) {
//           $scope.totalServerItems = countInfo.count;
//            
//            if ($scope && !$scope.$root.$$phase) {
//                $scope.$root.$apply();
//            }
//        });
//
        

        Jassa.sponate.angular.bridgePromise(promise, $q.defer(), $scope, function(countInfo) {
            // Note: There is also countInfo.hasMoreItems and countInfo.limit (limit where the count was cut off)
            $scope.totalServerItems = countInfo.count;
        });
    };
    
    $scope.refreshData = function(tableService) {
        tableService = tableService || createTableService();

        var page = $scope.pagingOptions.currentPage;
        var pageSize = $scope.pagingOptions.pageSize;
        
        var offset = (page - 1) * pageSize;

        
        var promise = tableService.fetchData(pageSize, offset);

//        promise.done(function(data) {
//            $scope.myData = data;
//            
//            if ($scope && !$scope.$root.$$phase) {
//                $scope.$root.$apply();
//            }
//        });

        /*
        $q.when(promise).then(function(data) {
            $scope.myData = data;
        });
        */

        Jassa.sponate.angular.bridgePromise(promise, $q.defer(), $scope, function(data) {
            $scope.myData = data;
        });
    };

        
    var plugins = [];
    
    if(ngGridFlexibleHeightPlugin) {
        // js-hint will complain on lower case ctor call
        var PluginCtor = ngGridFlexibleHeightPlugin;
        
        plugins.push(new PluginCtor(30));
    }
    
    $scope.myData = [];
    
    $scope.gridOptions = {
        data: 'myData',
        enablePaging: true,
        useExternalSorting: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        enableHighlighting: true,
        sortInfo: {
            fields: [],
            directions: [],
            columns: []
        },
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        plugins: plugins,
        columnDefs: 'colDefs'
    };

    

    $scope.refresh();
}])


/**
 * 
 * 
 * config: {
 *     queryFactory: qf,
 *     tableMod: tm
 * }
 * 
 */
.directive('sparqlTable', ['$parse', function($parse) {
    return {
        restrict: 'EA', // says that this directive is only for html elements
        replace: true,
        //template: '<div></div>',
        templateUrl: 'template/sparql-table/sparql-table.html',
        controller: 'SparqlTableCtrl',
        scope: {
            sparqlService: '=',
            config: '=',
            onSelect: '&select',
            onUnselect: '&unselect'
        },
        link: function (scope, element, attrs) {
            
        }
    };
}])

;
    

angular.module('ui.jassa.template-list', [])

/**
 *
 */
.controller('TemplateListCtrl', ['$scope', function($scope) {
}])

/**
 *
 */
.directive('templateList', ['$compile', function($compile) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'template/template-list/template-list.html',
        transclude: true,
        //require: 'templateList',
        scope: {
            templates: '=',
            data: '=',
            context: '='
        },
        //controller: 'TemplateListCtrl',
        compile: function() {
            return {
                pre: function(scope, elm, attrs) {
                    angular.forEach(scope.templates, function(template) {
                        var li = $compile('<li style="display: inline;"></li>')(scope);
                        
                        var element = $compile(template)(scope);
                        li.append(element);
                        
                        elm.append(li);
                    });
                }
            };
        }
    };
}])

;

angular.module("template/constraint-list/constraint-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/constraint-list/constraint-list.html",
    "<ul>\n" +
    "  	<li ng-show=\"constraints.length == 0\" style=\"color: #aaaaaa;\">(no constraints)</li>\n" +
    "   	<li ng-repeat=\"constraint in constraints\"><a href=\"\" ng-click=\"removeConstraint(constraint)\">{{constraint.label}}</a></li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("template/facet-tree/facet-dir-content.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-tree/facet-dir-content.html",
    "\n" +
    "<!-- ng-show=\"dirset.pageCount > 1 || dirset.children.length > 5\" -->\n" +
    "\n" +
    "\n" +
    "<!--                 		<div ng-show=\"dirset.pageCount != 1\" style=\"width:100%; background-color: #eeeeff\"> -->\n" +
    "<!--     		         		<pagination style=\"padding-left: {{16 * (dirset.path.getLength() + 1)}}px\" class=\"pagination-tiny\" max-size=\"7\" total-items=\"dirset.childFacetCount\" page=\"dirset.pageIndex\" boundary-links=\"true\" rotate=\"false\" on-select-page=\"selectFacetPage(page, facet)\" first-text=\"<<\" previous-text=\"<\" next-text=\">\" last-text=\">>\"></pagination> -->\n" +
    "<!--                 		</div> -->\n" +
    "\n" +
    "<span ng-show=\"dirset.children.length == 0\"\n" +
    "	style=\"color: #aaaaaa; padding-left: {{16*(dirset.path.getLength()+1)}}px\">(no\n" +
    "	entries)</span>\n" +
    "\n" +
    "<div style=\"padding-left: {{16*(dirset.path.getLength()+1)}}px\"\n" +
    "	ng-repeat=\"facet in dirset.children\"\n" +
    "	ng-include=\"'template/facet-tree/facet-tree-item.html'\" ></div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("template/facet-tree/facet-dir-ctrl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-tree/facet-dir-ctrl.html",
    "<div style=\"width: 100%; background-color: #eeeeff;\">\n" +
    "	<div style=\"padding-right: 16px; padding-left: {{16*(dirset.path.getLength()+1)}}px\">\n" +
    "\n" +
    "		<form class=\"form-inline\" role=\"form\" ng-submit=\"doFilter(dirset.path, dirset.filter.filterString)\">\n" +
    "\n" +
    "			<div class=\"form-group\">\n" +
    "				<input type=\"text\" class=\"form-control input-sm\" placeholder=\"Filter\" ng-model=\"dirset.filter.filterString\" value=\"{{dirset.filter.filterString}}\" />\n" +
    "			</div>\n" +
    "			<div class=\"form-group\">\n" +
    "				<button type=\"submit\" class=\"btn btn-default input-sm\">Filter</button>\n" +
    "			</div>\n" +
    "			<div class=\"form-group\" ng-if=\"dirset.pageCount > 1\" style=\"background-color: #eeeeff\">\n" +
    "				<pagination\n" +
    "					style=\"padding-left: {{16*(dirset.path.getLength()+1)}}px\"\n" +
    "					class=\"pagination-tiny\" max-size=\"7\"\n" +
    "					total-items=\"dirset.childFacetCount\" page=\"dirset.pageIndex\"\n" +
    "					boundary-links=\"true\" rotate=\"false\"\n" +
    "					on-select-page=\"selectFacetPage(page, facet)\" first-text=\"<<\"\n" +
    "					previous-text=\"<\" next-text=\">\" last-text=\">>\">\n" +
    "				</pagination>\n" +
    "			</div>\n" +
    "\n" +
    "		</form>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("template/facet-tree/facet-tree-item.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-tree/facet-tree-item.html",
    "<div ng-class=\"{'frame': facet.isExpanded}\">\n" +
    "\n" +
    "	<div class=\"facet-row\" ng-class=\"{'highlite': facet.isExpanded}\" ng-mouseover=\"setFacetHover(facet, true)\" ng-mouseleave=\"setFacetHover(facet, false)\">\n" +
    "		<a ng-show=\"facet.isExpanded\" href=\"\" ng-click=\"toggleCollapsed(facet.item.getPath())\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a>\n" +
    "		<a ng-show=\"!facet.isExpanded\" href=\"\" ng-click=\"toggleCollapsed(facet.item.getPath())\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>\n" +
    "\n" +
    "		<a href=\"\" title=\"Showing incoming facets. Click to show outgoing facets.\" ng-if=\"facet.isExpanded && facet.isIncomingActive === true\" ng-click=\"selectOutgoing(facet.item.getPath())\"><span class=\"glyphicon glyphicon-arrow-left\"></span></a>\n" +
    "		<a href=\"\" title=\"Showing outgoing facets. Click to show incoming facets.\" ng-if=\"facet.isExpanded && facet.isOutgoingActive === true\" ng-click=\"selectIncoming(facet.item.getPath())\"><span class=\"glyphicon glyphicon-arrow-right\"></span></a>\n" +
    "\n" +
    "\n" +
    "		<a data-rdf-term=\"{{facet.item.getNode().toString()}}\" title=\"{{facet.item.getNode().getUri()}}\" href=\"\" ng-click=\"toggleSelected(facet.item.getPath())\">{{facet.item.getDoc().displayLabel}}</a>\n" +
    "\n" +
    "		<template-list style=\"list-style:none; display: inline; padding-left: 0px;\" templates=\"plugins\" data=\"facet\" context=\"pluginContext\"></template-list>\n" +
    "\n" +
    "		<span style=\"float: right\" class=\"badge\" ng-bind-html=\"(facet.item.getDistinctValueCount() == null || facet.item.getDistinctValueCount() < 0) ? '&#8230;' : ('' + facet.item.getDistinctValueCount())\"></span>\n" +
    "		\n" +
    "		<div ng-if=\"facet.isExpanded && facet.isHovered && facet.isIncomingActive === true\" style=\"width:100%\" ng-repeat=\"dirset in [facet.incoming]\" ng-include=\"'template/facet-tree/facet-dir-ctrl.html'\"></div>\n" +
    "		<div ng-if=\"facet.isExpanded && facet.isHovered && facet.isOutgoingActive === true\" style=\"width:100%\" ng-repeat=\"dirset in [facet.outgoing]\" ng-include=\"'template/facet-tree/facet-dir-ctrl.html'\"></div>\n" +
    "	</div>\n" +
    "	<div ng-if=\"facet.isExpanded\" style=\"width:100%\"> \n" +
    "\n" +
    "\n" +
    "			<div ng-if=\"facet.isExpanded && facet.isIncomingActive === true\" ng-repeat=\"dirset in [facet.incoming]\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div>\n" +
    "			<div ng-if=\"facet.isExpanded && facet.isOutgoingActive === true\" ng-repeat=\"dirset in [facet.outgoing]\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div>\n" +
    "\n" +
    "\n" +
    "<!-- 		<tabset class=\"tabset-small\"> -->\n" +
    "<!-- 			<tab heading=\"Incoming Facets\" active=\"{{facet.isIncomingActive === true}}\" select=\"selectIncoming(facet.item.getPath())\"> -->\n" +
    "<!-- 				<div ng-repeat=\"dirset in [facet.incoming]\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div> -->\n" +
    "<!-- 			</tab> -->\n" +
    "<!-- 			<tab heading=\"Outgoing Facets\" active=\"{{facet.isOutgoingActive === true}}\" select=\"selectOutgoing(facet.item.getPath())\">					 -->\n" +
    "<!-- 				<div ng-repeat=\"dirset in [facet.outgoing]\" ng-include=\"'template/facet-tree/facet-dir-content.html'\"></div> -->\n" +
    "<!-- 			</tab> -->\n" +
    "		</tabset>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/facet-value-list/facet-value-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/facet-value-list/facet-value-list.html",
    "<div class=\"frame\">\n" +
    "	<form ng-submit=\"filterTable(filterText)\">\n" +
    "	    <input type=\"text\" ng-model=\"filterText\" />\n" +
    "		<input class=\"btn-primary\" type=\"submit\" value=\"Filter\" />\n" +
    "	</form>\n" +
    "	<table>\n" +
    "              <tr><th>Value</th><th>Constrained</th></tr>\n" +
    "<!-- <th>Count</th> -->\n" +
    "	    <tr ng-repeat=\"item in facetValues\">\n" +
    "                  <td>{{item.displayLabel}}</td>\n" +
    "<!--                    <td>todo</td> -->\n" +
    "                  <td><input type=\"checkbox\" ng-model=\"item.tags.isConstrainedEqual\" ng-change=\"toggleConstraint(item)\" /></td>\n" +
    "              </tr>\n" +
    "      	</table>\n" +
    "  		<pagination class=\"pagination-small\" total-items=\"pagination.totalItems\" page=\"pagination.currentPage\" max-size=\"pagination.maxSize\" boundary-links=\"true\" rotate=\"false\" num-pages=\"pagination.numPages\"></pagination>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/sparql-table/sparql-table.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/sparql-table/sparql-table.html",
    "<div>\n" +
    "<div ng-grid=\"gridOptions\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/template-list/template-list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/template-list/template-list.html",
    "<ul ng-show=\"templates.length > 0\">\n" +
    "</ul>");
}]);
