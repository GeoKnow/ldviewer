angular.module('dbpv.services', [])

	.factory('TafService', ['$rootScope', function($rootScope) {
		return {
			onPredicateChange:		function(about, predicates) {
				if (predicates !== undefined) {
					this.bindTaf(about, predicates);
					for (var id in predicates) {
						for (var i = 0; i<predicates[id].values.length; i++) {
							if (predicates[id].forward) {
								var val = predicates[id].values[i];
								if (val.literalLabel !== undefined && val.literalLabel.lang!== undefined && val.literalLabel.lang !== "") {
									dbpv.newAvailableLanguage(val.literalLabel.lang);
								}
							}
						}
					}
				}
			},
			
			bindTaf:				function(about, predicates) {
				var actions = this.getActions();
				for (var key in predicates) {
					var predicate = predicates[key];
					this.bindTafPredicate(about, predicate, actions);
				}
			},
			
			bindTafPredicate:		function(about, predicate, actions) {
				if (!actions) actions = this.getActions();
				for(var j = 0; j < predicate.values.length; j++) {
					var val = predicate.values[j];
					if (val.taf === undefined) {
						val.taf = [];
						for (var k = 0; k < actions.length; k++) {
							var subk = actions[k];
							try {
								var actionInstance = new subk(about, predicate, val);
								val.taf.push(actionInstance);
							} catch (err) {
								//console.log(err);
							}
						}
					}
				}
			},
			
			getActions:				function() {
				console.log("getting actions");
				var actions = [dbpv.Action];
				var i = 0;
				while (i < actions.length) {
					var action = actions[i];
					if (action.abstrait) {
						actions.splice(i, 1);
						i--;
					}
					for (var id in action.subclasses) {
						var act = action.subclasses[id];
						actions.push(act);
					}
					i++;
				}
				return actions;
			}
			
		};
	}])

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

	.factory('Entity', ['$rootScope', 'UrlService', '$q', 'JassaService', function($rootScope, UrlService, $q, JassaService) {
		return {
			triples: function(resource, predicates, reverse) {
				if (reverse === undefined) {
					reverse = false;
				}
			
				var deferred = $q.defer();
				
				var entityUrl = resource;
				
				var rdf = Jassa.rdf;	
				
				var about = $("[about]").attr("about");//XXX this is ugly
				
				var query = "";
				
				if (!reverse) {
					query = "SELECT DISTINCT * where {<"+entityUrl+"> ?p ?o}";
				} else {
					query = "SELECT DISTINCT ?p ?s WHERE {?su ?p <"+entityUrl+"> .FILTER (?p != <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>). {SELECT ?s WHERE {?s ?p <"+entityUrl+">} LIMIT 3 } }";
				}
				
				return JassaService.select(query, UrlService.endpoint, UrlService.endpointgraph)
					.then(
						function(resultset) {							
							
							var sVar = rdf.NodeFactory.createVar("s");
							var pVar = rdf.NodeFactory.createVar("p");
							var oVar = rdf.NodeFactory.createVar("o");
							
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								//console.log(binding);
								var prop = binding.get(pVar);
								var predid = prop.uri;
								var obj = {};
								if (!reverse) {
									obj = binding.get(oVar);
									predid = "i-"+predid;
									prop.forward = true;
								} else {
									obj = binding.get(sVar);
									predid = "o-"+predid;
									prop.forward = false;
								}
								var subj = about;
								var triple = new rdf.Triple(subj, prop, obj);
								
								if (predicates[predid] === undefined) {
									predicates[predid] = prop;
									var pred = predicates[predid];
									pred.predid = predid;
									pred.values = [];
								}
								pred.values.push(obj);
							}
							console.log("LOADED INQE");
							return null;
						},
						function(error) {
							return error;
						},
						function(update) {
							return update;
						}
					)
				;
			},
			
			reversePredicates:	function(resource, predicates) {
				var rdf = Jassa.rdf;
				var query = "SELECT DISTINCT ?p WHERE {?s ?p <"+resource+">.}";
				return JassaService.select(query, UrlService.endpoint, UrlService.endpointgraph)
					.then(
						function(resultset) {
							var pVar = rdf.NodeFactory.createVar("p");
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								//console.log(binding);
								var prop = binding.get(pVar);
								var predid = prop.uri;
								var obj = {};
								
								obj = {};
								predid = "o-"+predid;
								prop.forward = false;
								
								var subj = resource;
								var triple = new rdf.Triple(subj, prop, obj);
								
								if (predicates[predid] === undefined) {
									predicates[predid] = prop;
									var pred = predicates[predid];
									pred.predid = predid;
									pred.values = [];
								}
								//pred.values.push(obj);
							}
							console.log("LOADED INQE");
							return null;
						},
						function(error) {
						
						},
						function(update) {
						
						}
					)
				;
			},
			
			loadReverseValues:	function(resource, property, limit, offset) {
				var rdf = Jassa.rdf;
				var query = "SELECT ?s WHERE {?s <"+property.uri+"> <"+resource.uri+">} LIMIT "+limit+" OFFSET "+offset;
				return JassaService.select(query, UrlService.endpoint, UrlService.endpointgraph)
					.then(
						function(resultset) {
							var sVar = rdf.NodeFactory.createVar("s");
							var results = [];
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								var subj = binding.get(sVar);
								results.push(subj);
							}
							return results;
						},
						function(error) {
						
						},
						function(update) {
						
						}
					)
				;
			},
			
			loadReverseValuesCount:	function(resource, property) {
				var rdf = Jassa.rdf;
				var query = "SELECT COUNT(?s) AS ?c WHERE {?s <"+property.uri+"> <"+resource.uri+">}";
				return JassaService.select(query, UrlService.endpoint, UrlService.endpointgraph)
					.then(
						function(resultset) {
							var sVar = rdf.NodeFactory.createVar("c");
							var results = [];
							while(resultset.hasNext() && results.length == 0) {
								var binding = resultset.nextBinding();
								results.push(binding.get(sVar));
							}
							return results;
						}
					)
				;
			},
			
			relationInstances:	function(relationURL, number) {
				if (!number) {
					number = 100;
				}
				
				var rdf = Jassa.rdf;
				
				var query = "SELECT DISTINCT ?s ?o where {?s <"+relationURL+"> ?o} LIMIT "+number;
				
				return JassaService.select(query, UrlService.endpoint, UrlService.endpointgraph)
					.then(
						function(resultset) {
							var instances = [];
							var sVar = rdf.NodeFactory.createVar("s");
							//var pVar = rdf.NodeFactory.createVar("p");
							var oVar = rdf.NodeFactory.createVar("o");
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								console.log(binding);
								var subj = binding.get(sVar);
								var obj  = binding.get(oVar);
								
								var oneret = {"subj":subj, "obj":obj};
								instances.push(oneret);
								console.log(oneret);
							}
							console.log("relation instances loaded");
							return instances;
						},
						function(error){
						
						},
						function(update) {
						
						}
					)
				;
			},
			
			classInstances:	function(classURL, number) {
				if (!number) {
					number = 100;
				}
				
				var rdf = Jassa.rdf;
				
				var query = "SELECT DISTINCT ?s where {?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+classURL+">} LIMIT "+number;
				
				return JassaService.select(query, UrlService.endpoint, UrlService.endpointgraph)
					.then(
						function(resultset) {
							var sVar = rdf.NodeFactory.createVar("s");
							//var pVar = rdf.NodeFactory.createVar("p");
							var oVar = rdf.NodeFactory.createVar("o");
							
							var instances = [];
							
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								var subj = binding.get(sVar);
								instances.push(subj);
							}
							console.log("class instances loaded");
							return instances;
						},
						function(error) {
						
						},
						function(update) {
						
						}
					)
				;				
			},
			
			numberClassInstances: function(classURL) {
				var rdf = Jassa.rdf;
				var query = "SELECT COUNT(?x) AS ?c WHERE {?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+classURL+"> }";
				return JassaService.select(query, UrlService.endpoint, UrlService.endpointgraph)
					.then(
						function(resultset) {
							var cVar = rdf.NodeFactory.createVar("c");
							while (resultset.hasNext()) {
								var count = resultset.nextBinding().get(cVar).literalLabel.val;
							}
							return count;
						}
					)
				;
			}
		};
	}])
	.factory('Spotlight', ['$http', '$rootScope', function($http, $rootScope) {
		return {
			annotate: function(text) {
				delete $http.defaults.headers.common['X-Requested-With'];
				var endpoint = $rootScope.spotlightendpoint;
				$http.get(endpoint, "text="+text).success(function (data, status, headers, config) {

				})
				.error(function (data, status, headers, config) {

				});
			},
			annotate_async: function(text, callback, coming_through) {
								delete $http.defaults.headers.common['X-Requested-With'];
				var endpoint = $rootScope.spotlightendpoint;
				$http.get(endpoint+"?text="+encodeURIComponent(text)).success(function (data, status, headers, config) {	
					callback(data, coming_through);
				})
				.error(function (data, status, headers, config) {
					alert("Annotation error");
					callback(undefined, coming_through);
				});
			}
		};
	}])
	
	.factory('Search', ['UrlService', '$rootScope', '$q', function(UrlService, $rootScope, $q) {
		return {
			search:		function (term, number) {
				var deferred = $q.defer();
				
				if (!number) {
					number = 10;
				}
				
				var rdf = Jassa.rdf;
				var serve = Jassa.service;
				var sparqlService = new serve.SparqlServiceHttp(
					UrlService.endpoint,
					UrlService.endpointgraph
				);
				
				var searchfield = "http://www.w3.org/2000/01/rdf-schema#label";
				
				var query = 'SELECT DISTINCT ?s ?l where {?s <'+searchfield+'> ?l . FILTER(CONTAINS(LCASE(STR(?l)), LCASE("'+term+'")))} LIMIT '+number;
				//var query = 'SELECT DISTINCT ?s WHERE {?s ?p ?o . FILTER(CONTAINS
				
				var qe = sparqlService.createQueryExecution(query);
				qe.setTimeout(180000);
				
				var sVar = rdf.NodeFactory.createVar("s");
				//var pVar = rdf.NodeFactory.createVar("p");
				var lVar = rdf.NodeFactory.createVar("l");
				
				results = [];
				
				qe.execSelect()
					.done(function(resultset) {
						$rootScope.$apply(function() {
							var predicates = {};
							var hasresults = false;
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								var subj = binding.get(sVar);
								var label = binding.get(lVar);
								if (label.literalLabel) {
									var ldist = levenshtein(label.literalLabel.lex, term);
									var obj = {"uri": subj, "dist": ldist, "label": label};
									results.push(obj);
								}
							}
							results.sort(function(a, b) {
								return a.dist - b.dist;
							});
							//console.log(results);
							deferred.resolve(results);
						});
					})
					.fail(function(err) {
						$rootScope.$apply( function() {
							console.log("search query failed");
							deferred.reject("searching with SPARQL failed");
						});
					})
				;
			
				function levenshtein (a, b) {
					/* copyright: andrew hedges
						http://andrew.hedges.name/
					*/
					var cost;
					
					// get values
					var m = a.length;
					var n = b.length;
					
					// make sure a.length >= b.length to use O(min(n,m)) space, whatever that is
					if (m < n) {
						var c=a;a=b;b=c;
						var o=m;m=n;n=o;
					}
					
					var r = new Array();
					r[0] = new Array();
					for (var c = 0; c < n+1; c++) {
						r[0][c] = c;
					}
					
					for (var i = 1; i < m+1; i++) {
						r[i] = new Array();
						r[i][0] = i;
						for (var j = 1; j < n+1; j++) {
							cost = (a.charAt(i-1) == b.charAt(j-1))? 0: 1;
							r[i][j] = levenshtein_minimator(r[i-1][j]+1,r[i][j-1]+1,r[i-1][j-1]+cost);
						}
					}
					
					return r[m][n];
				};

				function levenshtein_minimator (x,y,z) {
					if (x < y && x < z) return x;
					if (y < x && y < z) return y;
					return z;
				};
				
				return deferred.promise;
			}
		};
	}])
	
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
