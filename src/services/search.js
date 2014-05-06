
angular.module('ldv.services.search', ['ldv.services.UrlService'])
	.factory('Search', ['UrlService', '$rootScope', '$q', function(UrlService, $rootScope, $q) {
		return {
			search:		function (term, number) {
				var deferred = $q.defer();
				
				if (!number) {
					number = 10;
				}
				number = 25;
				
				var rdf = Jassa.rdf;
				var serve = Jassa.service;
				var sparqlService = new serve.SparqlServiceHttp(
					UrlService.endpoint(),
					UrlService.endpointgraph()
				);
				
				var searchfield = "http://www.w3.org/2000/01/rdf-schema#label";
				
				//var query = 'SELECT DISTINCT ?s ?l where {?s <'+searchfield+'> ?l . FILTER(CONTAINS(LCASE(STR(?l)), LCASE("'+term+'")))} LIMIT '+number;
				//var query = 'SELECT DISTINCT ?s ?l where {?s <'+searchfield+'> ?l . FILTER(bif:contains(?l, "'+term+'"))} LIMIT '+number;
				term = term.replace(/\s/g, "_");
				//alert(term);
				var query = 'select ?s ?l {?s <'+searchfield+'> ?l . ?l bif:contains "'+term+'" . filter(contains(str(?s), "http://dbpedia.org/"))} LIMIT '+number;
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
								var beginuri = subj.uri.slice(0, UrlService.localgraph().length);
								if (beginuri == UrlService.localgraph() && label.literalLabel) {
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
;
