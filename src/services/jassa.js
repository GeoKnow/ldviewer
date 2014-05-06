
angular.module('ldv.services.jassa', [])
	.factory('JassaService', ['$q', '$rootScope', function($q, $rootScope) {
		return {
			select:	function(query, endpoint, endpointgraph, timeout) {
				var deferred = $q.defer();
				if (!timeout) {
					timeout = 60000;
				}
				
				var serve = Jassa.service;
				var sparqlService = new serve.SparqlServiceHttp(endpoint, endpointgraph);
				
				var qe = sparqlService.createQueryExecution(query);
				qe.setTimeout(timeout);
				
				qe.execSelect()
					.done(function(resultset) {
						$rootScope.$apply(function() {
							deferred.resolve(resultset);
						});
					})
					.fail(function(error) {
						$rootScope.$apply(function() {
							deferred.reject(error);
						});
					})
				;
				return deferred.promise;
			}
		}
	}])
;
