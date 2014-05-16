
angular.module('ldv.ui.classInstances', ['ldv.table.displayNode', 'ldv.ui.pagination', 'ui.jassa', 'ldv.templates.ui'])
.directive('dbpvClassInstances', function() {
	return {
		restrict:	"EA",
		replace:	true,
		scope:		{
						about:	"=",
						primarylang:	"=",
						fallbacklang:	"="
						
					},
		templateUrl:	'ui/classInstances/classInstances.html',
		controller:	"DbpvClassInstancesCtrl",
	};
})

	.controller('DbpvClassInstancesCtrl', ['$scope', 'Entity', 'UrlService', function($scope, Entity, UrlService) {
	
		// faceted browsing code //
		var service = Jassa.service;
		var facete = Jassa.facete;
		
		var sparqlServiceFactory = new service.SparqlServiceFactoryDefault();

		$scope.sparqlService = new service.SparqlServiceHttp(UrlService.endpoint(), UrlService.endpointgraph());
		
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
		
		$scope.processFacetedValues = function() {
			var fvs = new facete.FacetValueService($scope.sparqlService, $scope.facetTreeConfig)
			var fetcher = fvs.createFacetValueFetcher(new facete.Path(), "");
			
			var p1 = fetcher.fetchCount();
			var p2 = fetcher.fetchData(0, 10);
			
			var result = jQuery.when.apply(null, [p2, p1]).pipe(function(data, count) {
				$scope.instances = [];
				for (var i = 0; i < data.length; i++) {
					var result = data[i];
					if (result.node) {
						$scope.instances.push(result.node);
					}
				}
				
				$scope.total = count;
				
				$scope.$apply();
				
			});//*/
		};
		
		//$scope.processFacetedValues();
		// end faceted browsing code //
		
		
		$scope.showPaginator = true;
		
		$scope.perpage = 15;
		$scope.page = 0;
		$scope.total = 0;
		
		$scope.criteria = "?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+$scope.about.uri+">";
		
		$scope.getInstanceNumber = function() {
			if ($scope.showInstances) {
				
				/*
				Entity.loadReverseValuesCount($scope.about, {"uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"})
					.then(
						function(number) {
							$scope.total = number[0].literalLabel.val;
						}
					)
				;
				/*Entity.loadFacetedCount($scope.criteria, $scope.perpage, $scope.offset).
					then(
						function(number) {
							$scope.total = number[0].literalLabel.val;
						}
					)
				;//*/
			}
		};
		
	
		LDViewer.showClassInstances = function() {
			$scope.showInstances = true;
			//$scope.getInstanceNumber();
			$scope.loadInstances();
		};
		
		$scope.loadInstances = function() {
			if ($scope.showInstances) {
				$scope.processFacetedValues();
				/*Entity.loadReverseValues($scope.about, {"uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"}, $scope.perpage, $scope.offset)
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
		
		    $scope.ObjectUtils = Jassa.util.ObjectUtils;
		
		
		$scope.$watch('ObjectUtils.hashCode(facetTreeConfig)', function(cfg) {
			$scope.loadInstances();
		}, true);
		
		$scope.$watch('page', function(page) {
			$scope.offset = $scope.page * $scope.perpage;
			$scope.loadInstances();
		});
		
		$scope.$watch('total', function(total) {
			$scope.loadInstances();
		});
	}])

;