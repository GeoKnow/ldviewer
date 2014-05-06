
angular.module('ldv.ui.classInstances', ['ldv.table.displayNode', 'ldv.ui.pagination', 'ui.jassa'])
.directive('dbpvClassInstances', function() {
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