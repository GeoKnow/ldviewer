
angular.module('ldv.services.preview', [])	
	.factory('Preview', ['$http', function($http) {
		return {getProperty: function (rurl, prop, scope, graph, endpoint) {
				if (scope.previewSemaphore === undefined) {
					scope.previewSemaphore = 0;
				}
				var vals = [];
				var values = [];
				var uri;
				if (rurl.slice(0, graph.length) == graph) {
					uri = rurl;
				} else {
					uri = graph+rurl;
				}
				var query = "SELECT DISTINCT ?p WHERE {<"+uri+"> <"+prop+"> ?p}";
				var rdf = Jassa.rdf;
				var serve = Jassa.service;
				var sparqlService = new serve.SparqlServiceHttp(
					endpoint,
					['http://dbpedia.org'] //TODO THIS IS A HACK
				);
				var inqe = sparqlService.createQueryExecution(query);
				inqe.setTimeout(60000);
				
				var pVar = rdf.NodeFactory.createVar("p");
				//scope.previewSemaphore ++;
				inqe.execSelect()
					.done(function(resultset) {
						scope.previewSemaphore --;
						while(resultset.hasNext()) {
							var binding = resultset.nextBinding();
							var prop = binding.get(pVar);
							vals.push(prop);
						}
						scope.$digest();
					})
					.fail(function(err) {
						scope.previewSemaphore --;
						console.log("Preview Query FAILED");
					})
				;
				/*delete $http.defaults.headers.common['X-Requested-With'];
				var prevdef = $http.defaults.headers.post['Content-Type'];
				$http.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded";
				var query = "SELECT DISTINCT ?prop WHERE {<"+uri+"> <"+prop+"> ?prop}";
				query = encodeURIComponent(query);
				loadingSemaphore.count += 1;
				/*var scope = angular.element($('body')).scope();
				var defaultgraphs = "";
				for (var i = 0; i<scope.endpointgraph.length; i++) {
					defaultgraphs += "default-graph-uri=" + scope.endpointgraph[i] + "&";
				}
				//
				//TODO default graphs disabled for preview because of dataset troubles
				$http.post(endpoint, "query="+query, {timeout:60000}).success(function (data, status, headers, config) {
					loadingSemaphore.count -= 1;
					var values = data["results"]["bindings"];
					for (var j = 0; j<values.length; j++) {
						var val = values[j]['prop'];
						dbpv_preprocess_triple_value(val, graph);
						vals.push(val);
					}
				})
				.error(function (data, status, headers, config) {
					loadingSemaphore.count -= 1;
					//alert("Couldn't load preview property");
				});
				$http.defaults.headers.post['Content-Type'] = prevdef;
				*/
				return vals;
			}
		};
	}]);
