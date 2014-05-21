
angular.module('ldv.services.entity', ['ldv.services.UrlService', 'ldv.services.jassa'])
	.factory('Entity', ['$rootScope', 'UrlService', '$q', 'JassaService', function($rootScope, UrlService, $q, JassaService) {
		return {
			triples: function(resource, prdicates, reverse) {
				// XXX prdicates not used
				if (reverse === undefined) {
					reverse = false;
				}
				
				var entityUrl = resource;
				if (LDViewer.getConfig("encodegraph") == true) {
					entityUrl = encodeURI(entityUrl);
				}
				
				var rdf = Jassa.rdf;	
				
				var about = $("[about]").attr("about");//XXX this is ugly
				
				var query = "";
				var labelquery = "";
				
				if (!reverse) {
					query = "SELECT DISTINCT * where {<"+entityUrl+"> ?p ?o}";
					if ($rootScope.showLabels) {
						labelqueries = ["SELECT DISTINCT ?p as ?x ?pl ?l WHERE { ?p ?pl ?l . {"+query + "}", "SELECT DISTINCT ?o as ?x ?pl ?l WHERE { ?o ?pl ?l . {"+query + "}"];
					}
				} else {
					query = "SELECT DISTINCT ?p ?s WHERE {?su ?p <"+entityUrl+"> .FILTER (?p != <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>). {SELECT ?s WHERE {?s ?p <"+entityUrl+">} LIMIT 3 } }";
				}
				
				var assignLabels = this.assignLabels;
				
				var status = LDViewer.addStatus("Fetching data", '<span class="glyphicon glyphicon-download-alt"></span>');
				
				var request = JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph())
					.then(
						function(resultset) {
							var labelnodes = [];
							
							var predicates = {};
							
							if (status) status.delete();
							
							var sVar = rdf.NodeFactory.createVar("s");
							var pVar = rdf.NodeFactory.createVar("p");
							var oVar = rdf.NodeFactory.createVar("o");
							
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								//console.log(binding);
								var prop = binding.get(pVar);
															labelnodes.push(prop);
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
															labelnodes.push(obj);
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
							assignLabels(labelqueries, labelnodes);
							console.log("LOADED INQE");
							var ret = {};
							ret.predicates = predicates;
							ret.labelnodes = labelnodes;
							ret.labelqueries = labelqueries;
							return predicates;
						},
						function(error) {
							if (status) status.delete();
							return error;
						},
						function(update) {
							return update;
						}
					)
				;
				
				return request;
			},
			
			labelledQuery:	function(q, labelvars) {
				if ($rootScope.showLabels) {
					for (var i = 0; i < $rootScope.labelPrefs; i++) {
					
					}
				}
			},
			
			assignLabels:	function(queries, nodes) {
				console.log("assigning labels");
				//(function(queries, nodes) {
				if ($rootScope.showLabels) {
				var rdf = Jassa.rdf;
				var labelPrefs = $rootScope.labelPrefs;
				
				var status = LDViewer.addStatus('Fetching labels','<span class="glyphicon glyphicon-download-alt"></span>');
				
				var promises = [];
				
				for (var q = 0; q < queries.length; q++) {
					query = queries[q];
					query = query+". FILTER(";
					for (var j = 0; j < labelPrefs.length ; j++) {
						var addx = "(?pl = <" + labelPrefs[j] + ">)";
						if (j < labelPrefs.length -1) {
							addx += " || ";
						}
						query += addx;
					}
					query += ")}";
					console.log(query);//*/
					
					/*
					var statusobj = {"icon": '<span class="glyphicon glyphicon-download-alt"></span>', "text": "Fetching labels"};
					var status = LDViewer.addStatus(statusobj);
					//*/
					
					
					var promise = JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph())
						.then(
							function(resultset) {
								var labelmap = {};
								var xVar = rdf.NodeFactory.createVar("x");
								var plVar = rdf.NodeFactory.createVar("pl");
								var lVar = rdf.NodeFactory.createVar("l");
								while (resultset.hasNext()) {
									var binding = resultset.nextBinding();
									var label = binding.get(lVar);
									var lprop = binding.get(plVar).uri;
									var thing = binding.get(xVar).uri;
									if (!labelmap[thing]) {
										labelmap[thing] = [];
									}
									if (!labelmap[thing][lprop]) {
										labelmap[thing][lprop] = [];
									}
									labelmap[thing][lprop].push(label);
								}
								for (var key in labelmap) {
									var labels = null;
									for (var k = 0; k < labelPrefs.length; k++) {
										var labelprops = labelmap[key];
										for (var labelprop in labelprops) {
											if (labelPrefs[k] == labelprop) {
												labels = labelprops[labelprop];
												break;
											}
										}
										if (labels)
											break;
									}
									if (labels) 
										labelmap[key] = labels;
								}
								for (var i = 0 ; i < nodes.length; i++) {
									var node = nodes[i];
									if (node.uri && labelmap[node.uri]) {
										var labels = labelmap[node.uri];
										if (labels && labels.length > 0)
											node.labelNodes = labels;
									}
								}
								//$rootScope.$apply();
							},
							
							function(fail) {
								if (status) status.delete();
							}
						)
					;
					
					promises.push(promise);
					
					$q.all(promises)
						.then(
							function(promisemap) {
								if (status) status.delete();
							}
						)
					;
				}
				}
				//})(queries, nodes);
			},
			
			reversePredicates:	function(resource, prdicates) {
				var rdf = Jassa.rdf;
				var query = "SELECT DISTINCT ?p WHERE {?s ?p <"+resource+">.}";
				var labelqueries = ["SELECT DISTINCT ?p as ?x ?pl ?l WHERE { ?p ?pl ?l . {"+query + "}"];
				var assignLabels = this.assignLabels;
				
				var status = LDViewer.addStatus("Fetching reverse predicates", '<span class="glyphicon glyphicon-download-alt"></span>');
				
				return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph())
					.then(
						function(resultset) {
							var predicates = {};
							if (status) status.delete();
							var pVar = rdf.NodeFactory.createVar("p");
							var labelnodes = [];
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								//console.log(binding);
								var prop = binding.get(pVar);
																labelnodes.push(prop);
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
							assignLabels(labelqueries, labelnodes);
							console.log("LOADED INQE");
							return predicates;
						},
						function(error) {
							if (status) status.delete();
						},
						function(update) {
						
						}
					)
				;
			},
			
			loadReverseValues:	function(resource, property, limit, offset) {
				var rdf = Jassa.rdf;
				var query = "SELECT ?s WHERE {?s <"+property.uri+"> <"+resource.uri+">} LIMIT "+limit+" OFFSET "+offset;
				var labelqueries = ["SELECT DISTINCT ?s as ?x ?pl ?l WHERE { ?s ?pl ?l . {"+query + "}"];
				var assignLabels = this.assignLabels;
				
				var status = LDViewer.addStatus("Fetching data", '<span class="glyphicon glyphicon-download-alt"></span>');
				
				return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph())
					.then(
						function(resultset) {
							if (status) status.delete();
							var sVar = rdf.NodeFactory.createVar("s");
							var results = [];
							var labelnodes = [];
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								var subj = binding.get(sVar);
															labelnodes.push(subj);
								results.push(subj);
							}
							assignLabels(labelqueries, labelnodes);
							return results;
						},
						function(error) {
							if (status) status.delete();
						
						},
						function(update) {
						
						}
					)
				;
			},
			
			loadReverseValuesCount:	function(resource, property) {
				var rdf = Jassa.rdf;
				var query = "SELECT COUNT(?s) AS ?c WHERE {?s <"+property.uri+"> <"+resource.uri+">}";
				return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph())
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
				var labelqueries = ["SELECT DISTINCT ?s as ?x ?pl ?l WHERE { ?s ?pl ?l . {"+query + "}", "SELECT DISTINCT ?o as ?x ?pl ?l WHERE { ?o ?pl ?l . {"+query + "}"];
				var assignLabels = this.assignLabels;
				
				var status = LDViewer.addStatus("Fetching relation instances", '<span class="glyphicon glyphicon-download-alt"></span>');
				
				return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph())
					.then(
						function(resultset) {
							if (status) status.delete();
							var instances = [];
							var sVar = rdf.NodeFactory.createVar("s");
							//var pVar = rdf.NodeFactory.createVar("p");
							var oVar = rdf.NodeFactory.createVar("o");
							var labelnodes = [];
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								console.log(binding);
								var subj = binding.get(sVar);
								var obj  = binding.get(oVar);
														labelnodes.push(subj);
														labelnodes.push(obj);
								
								var oneret = {"subj":subj, "obj":obj};
								instances.push(oneret);
								console.log(oneret);
							}
							assignLabels(labelqueries, labelnodes);
							console.log("relation instances loaded");
							return instances;
						},
						function(error){
							if (status) status.delete();
						
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
				var labelqueries = ["SELECT DISTINCT ?s as ?x ?pl ?l WHERE { ?s ?pl ?l . {"+query + "}"];
				
				var assignLabels = this.assignLabels;
				
				var status = LDViewer.addStatus("Fetching class instances", '<span class="glyphicon glyphicon-download-alt"></span>');
				
				return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph())
					.then(
						function(resultset) {
							if (status) status.delete();
							var sVar = rdf.NodeFactory.createVar("s");
							
							var instances = [];
							var labelnodes = [];
							while(resultset.hasNext()) {
								var binding = resultset.nextBinding();
								var subj = binding.get(sVar);
														labelnodes.push(subj);
								instances.push(subj);
							}
							assignLabels(labelqueries, labelnodes);
							console.log("class instances loaded");
							return instances;
						},
						function(error) {
							if (status) status.delete();
						
						},
						function(update) {
						
						}
					)
				;				
			},
			
			numberClassInstances: function(classURL) {
				var rdf = Jassa.rdf;
				var query = "SELECT COUNT(?x) AS ?c WHERE {?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <"+classURL+"> }";
				return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph())
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
;
