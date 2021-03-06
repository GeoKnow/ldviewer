var ldv = angular.module('ldv', [
    'ngRoute',
    'ldv.services',
    'ldv.controller',
    'ldv.table',
    'ldv.ui',
    'ldv.pretty',
    'ldv.templates.main'
  ]);
var LDViewer = {};
LDViewer.configure = function (confun) {
  LDViewer.customConfigFunction = confun;
};
LDViewer.doConfigure = function () {
  LDViewer.customConfigFunction();
};
ldv.config([
  '$routeProvider',
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $routeProvider.when('/test', { templateUrl: 'tpl/test.html' }).when('/search/:q', {
      templateUrl: 'tpl/search.html',
      controller: 'SearchCtrl'
    }).when('/resource/:page', {
      redirectTo: function (params, a, search) {
        return '/page/' + params.page;
      }
    }).when('/:a/:b', {
      templateUrl: 'tpl/entity.html',
      controller: 'MetaCtrl'
    }).when('/:a/:b/:c', {
      templateUrl: 'tpl/entity.html',
      controller: 'MetaCtrl'
    }).when('/:a/:b/:c/:d/:e/:f/:g/:h/:i', {
      templateUrl: 'tpl/entity.html',
      controller: 'MetaCtrl'
    }).otherwise({ redirectTo: '/resource/404' });
  }
]);
//*/
ldv.run([
  '$rootScope',
  function ($rootScope) {
    $rootScope.entitySemaphore = 0;
    $rootScope.$watch('localgraph', function (lg) {
      $rootScope.endpointgraph = [lg];
    });
    LDViewer.setConfig = function (config, value) {
      $rootScope[config] = value;
    };
    LDViewer.getConfig = function (config) {
      return $rootScope[config];
    };
    $rootScope.loadSuccess = function () {
      $rootScope.failMessage = undefined;
    };
    $rootScope.loadFailed = function (msg) {
      $rootScope.failMessage = msg;
    };
    $rootScope.serverError = function (msg) {
      $rootScope.failMessage = msg;
    };
    $rootScope.$watch('failMessage', function (msg) {
      if (msg && msg.length > 1)
        LDViewer.addNotification(msg, 10000);
    });
    LDViewer.configure(LDViewer.configuration);
    LDViewer.doConfigure();
    // LOAD SETTINGS FROM COOKIES
    var cookies = $.cookie();
    for (var key in cookies) {
      var settingsprefix = 'dbpv_setting_';
      if (key.slice(0, settingsprefix.length) == settingsprefix) {
        var val = cookies[key];
        if (val == 'true')
          val = true;
        if (val == 'false')
          val = false;
        $rootScope[key.slice(settingsprefix.length, key.length)] = val;
      }
    }
  }
]);
angular.module('ldv.controller', [
  'ldv.services.UrlService',
  'ldv.ui.survey'
]).controller('MetaCtrl', [
  '$rootScope',
  '$scope',
  '$routeParams',
  '$filter',
  '$timeout',
  '$http',
  '$compile',
  '$location',
  'UrlService',
  function ($rootScope, $scope, $routeParams, $filter, $timeout, $http, $compile, $location, UrlService) {
    //LDViewer.configure(LDViewer.configuration);
    //LDViewer.doConfigure();
    LDViewer.about = function (about) {
      if (about === undefined) {
        return $scope.about;
      } else {
        $rootScope.about = about;
      }
    };
    if ($routeParams.a == 'page') {
      $routeParams.a = 'resource';
    }
    // Language setting
    if ($.cookie('dbpv_primary_lang') === undefined) {
      $.cookie('dbpv_primary_lang', $rootScope.primarylang, {
        expires: 90,
        path: '/'
      });
    } else {
      $rootScope.primarylang = $.cookie('dbpv_primary_lang');
    }
    $rootScope.$watch('primarylang', function (lang) {
      $.cookie('dbpv_primary_lang', $rootScope.primarylang);
    });
    var resource = UrlService.processResource($routeParams);
    LDViewer.about({ uri: resource });
    LDViewer.http = $http;
    delete $http.defaults.headers.common['X-Requested-With'];
    LDViewer.compile = $compile;
    $scope.loadFail = function () {
      LDViewer.addNotification('Loading failed.', 10000);
    };
    $scope.noInfo = function () {
      LDViewer.addNotification('No information about this resource available.', 10000);
    };
    LDViewer.preprocess_triple_url = function (url) {
      return UrlService.makeUrl(url).uri;  /*if (url.slice(0, $scope.localgraph.length) == $scope.localgraph) {
			url = $scope.localprefix + url.slice($scope.localgraph.length, url.length);
		}
		return url;*/
    };
  }
]);
angular.module('ldv.pretty.links', ['ldv.templates.pretty']).directive('prettyLinks', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: { links: '=' },
    templateUrl: 'pretty/prettyLinks/prettyLinks.html'
  };
});
angular.module('ldv.pretty.list', [
  'ldv.table.displayNode',
  'ldv.filters',
  'ldv.templates.pretty'
]).directive('dbpvpList', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: {
      properties: '=',
      primarylang: '=',
      fallbacklang: '='
    },
    templateUrl: 'pretty/prettyList/prettyList.html',
    controller: 'DbpvpListCtrl'
  };
}).controller('DbpvpListCtrl', [
  '$scope',
  function ($scope) {
    $scope.showProperties = function () {
      return $scope.properties.length > 0;
    };
    $scope.displayset = { 'noprefix': true };
    $scope.prioSort = function (property) {
      if (property && property.priority) {
        return property.priority;
      } else {
        return 0;
      }
    };
    LDViewer.getPrettyPropertyAdder = function (predicate, priority) {
      if (predicate && predicate.uri) {
        var property = null;
        for (var i = 0; i < $scope.properties.length; i++) {
          if ($scope.properties[i].key.uri == predicate.uri) {
            property = $scope.properties[i];
            break;
          }
        }
        if (!property) {
          property = {};
          property.key = predicate;
          property.values = [];
          $scope.properties.push(property);
        }
        if (property) {
          property.priority = priority;
          return function (value) {
            if (value) {
              property.values.push(value);
            }
          };
        }
      }
    };
  }
]);
;
angular.module('ldv.pretty.map', ['ldv.templates.pretty']).directive('dbpvpMap', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    templateUrl: 'pretty/prettyMap/prettyMap.html',
    scope: {},
    controller: 'DbpvpMapCtrl'
  };
}).controller('DbpvpMapCtrl', [
  '$scope',
  function ($scope) {
    // OLD COORDINATES REMAIN !!!
    LDViewer.setMapCoord = function (coord) {
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
    $scope.updateCoords = function () {
      //$scope.coordLon = -90.0;
      //$scope.coordLat = 90.0;
      if ($scope.lon && $scope.lat) {
        $('#dbpvpmap').attr('class', 'dbpvpmap-active');
        if ($scope.mapview === undefined) {
          //$scope.mapview.remove();
          $scope.mapview = L.map('dbpvpmap');
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '<a href=\'http://osm.org/copyright\'>&copy;</a>' }).addTo($scope.mapview);
        } else {
        }
        $scope.mapview.setView([
          $scope.lon,
          $scope.lat
        ], 10);
        if ($scope.micon === undefined) {
          $scope.micon = L.icon({
            iconUrl: 'css/marker-icon.png',
            shadowUrl: 'css/marker-shadow.png',
            iconSize: [
              25,
              41
            ],
            shadowSize: [
              41,
              41
            ],
            iconAnchor: [
              13,
              40
            ],
            shadowAnchor: [
              13,
              40
            ],
            popupAnchor: [
              -3,
              -50
            ]
          });
        }
        if ($scope.marker === undefined) {
          $scope.marker = L.marker([
            $scope.lon,
            $scope.lat
          ], { icon: $scope.micon });
          $scope.marker.addTo($scope.mapview);
        } else {
          $scope.marker.setLatLng([
            $scope.lon,
            $scope.lat
          ]);
        }  //TODO DOESN'T WORK WITH AUSTRALIA FOR SOME REASON !!!!!! goes east of japan ---> FIXED???? (dubbele GEORSS coords)
           //if ($scope.marker) alert("no marker");
      }  /* else {
				$('#dbpvpmap').removeClass('dbpvpmap-active');
				if (typeof($scope.mapview) != "undefined") {
					$scope.mapview.remove();
				}
				console.log($scope.mapview);
			}//*/
    };  /*$scope.lon = undefined;
		$scope.lat = undefined;
		$scope.updateCoords();//*/
  }
]);
;
angular.module('ldv.pretty.types', [
  'ldv.preview',
  'ldv.filters',
  'ldv.services.preview',
  'ldv.services.UrlService',
  'ldv.templates.pretty'
]).directive('prettyTypes', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: {
      types: '=',
      primarylang: '=',
      fallbacklang: '=',
      owlgraph: '=',
      owlendpoint: '='
    },
    templateUrl: 'pretty/prettyTypes/prettyTypes.html',
    controller: 'PrettyTypesCtrl'
  };
}).controller('PrettyTypesCtrl', [
  '$scope',
  function ($scope) {
    $scope.$watch('types', function (types) {
      console.log('types changed');
    }, true);
  }
]).directive('prettyType', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: false,
    scope: {
      node: '=',
      primarylang: '=',
      fallbacklang: '=',
      owlgraph: '=',
      owlendpoint: '='
    },
    template: '<span><a href="{{url}}" dbpv-preview>{{label}}</a></span>',
    controller: 'PrettyTypeCtrl'
  };
}).controller('PrettyTypeCtrl', [
  '$scope',
  '$filter',
  'Preview',
  'UrlService',
  function ($scope, $filter, Preview, UrlService) {
    //$scope.$watch('node', function(node) {
    var local = false;
    var url = $scope.node.uri;
    $scope.label = $scope.node.uri;
    var prefshor = UrlService.prefixify($scope.node.uri);
    var urlobj = UrlService.makeUrl($scope.node.uri);
    url = urlobj.uri;
    var display = '';
    if (prefshor !== undefined && prefshor.length > 1) {
      $scope.url = url;
      if (true || urlobj.local) {
        $scope.label = prefshor[1];
        display = '<a href="' + url + '"' + ' dbpv-preview>' + $scope.label + '</a>';
      } else {
        $scope.label = prefshor[0] + ':' + prefshor[1];
        display = '<a href="' + url + '">' + $scope.label + '</a>';
      }
      $scope.nodedisplay = display;
    }
    $scope.labellist = Preview.getProperty($scope.node.uri, 'http://www.w3.org/2000/01/rdf-schema#label', $scope, '', $scope.owlendpoint);
    $scope.updateLabel = function (list) {
      var labl = $filter('languageFilter')(list, $scope.primarylang, $scope.fallbacklang)[0];
      if (labl !== undefined) {
        labl = labl.literalLabel.lex;
        $scope.label = labl;
      }
    };
    $scope.$watch('labellist', function (list) {
      $scope.updateLabel($scope.labellist);  // WHY U NO UPDATE WHEN PREVIEW RESPONSE COMES IN???????
    }, true);
    $scope.$watch('primarylang', function (lang) {
      $scope.updateLabel($scope.labellist);
    });  //});*/
  }
]);
;
angular.module('ldv.pretty', [
  'ldv.pretty.types',
  'ldv.pretty.links',
  'ldv.pretty.list',
  'ldv.pretty.map',
  'ldv.filters',
  'ldv.templates.pretty'
]).directive('prettyBox', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: {
      about: '=',
      primarylang: '=',
      fallbacklang: '=',
      owlgraph: '=',
      owlendpoint: '='
    },
    templateUrl: 'pretty/prettybox/prettybox.html',
    controller: 'PrettyBoxCtrl'
  };
}).controller('PrettyBoxCtrl', [
  '$scope',
  '$rootScope',
  function ($scope, $rootScope) {
    LDViewer.applyPrettyBox = function (fn) {
      //$scope.$apply(
      fn($scope.dbpvp);  //);
    };
    $rootScope.$watch('entitySemaphore', function (semaphore) {
      $scope.semaphore = semaphore;
    });
    $scope.dbpvp = {};
    $scope.dbpvp.properties = [];
    $rootScope.$watch('failMessage', function (msg) {
      if (msg) {
        $scope.loadmsg = msg;
        $scope.showMsg = true;
      } else {
        $scope.showMsg = false;
      }
    });
  }
]);
;
angular.module('ldv.services.UrlService', []).factory('UrlService', [
  '$rootScope',
  function ($rootScope) {
    return {
      localgraph: function () {
        return $rootScope.localgraph;
      },
      endpointgraph: function () {
        return $rootScope.endpointgraph;
      },
      endpoint: function () {
        return $rootScope.endpoint;
      },
      primarylang: function () {
        return $rootScope.primarylang;
      },
      fallbacklang: function () {
        return $rootScope.fallbacklang;
      },
      localUrl: function (url) {
        return $rootScope.localgraph !== undefined && $rootScope.localprefix !== undefined && url.uri.slice(0, $rootScope.localgraph.length) == $rootScope.localgraph;
      },
      makeUrl: function (uri) {
        var url = { 'uri': uri };
        if (this.localUrl(url)) {
          url.uri = url.uri.slice($rootScope.localgraph.length, url.uri.length);
          url.uri = $rootScope.localprefix + url.uri;
          url.local = true;
        }
        if ($rootScope.godmode) {
          url.uri = url.uri.replace(/^.*:\/\//, '');
          url.uri = $rootScope.localprefix + '/' + url.uri;
        }
        return url;
      },
      defaultUri: function (url) {
        if ($rootScope.localprefix != undefined && url.slice(0, $rootScope.localprefix.length) == $rootScope.localprefix) {
          url = url.slice($rootScope.localprefix.length, url.length);
        }
        var prefixPresent = 'http://';
        //prefixPresent = $rootScope.localgraph;
        if ($rootScope.localgraph !== undefined && url.slice(0, prefixPresent.length) == prefixPresent) {
          return url;
        } else {
          return $rootScope.localgraph + url;
        }
      },
      prefixify: function (uri) {
        if (uri !== undefined && uri !== null) {
          for (var prefix in $rootScope.prefixes) {
            if (uri.slice(0, prefix.length) == prefix) {
              pref = $rootScope.prefixes[prefix];
              shor = uri.slice(prefix.length, uri.length);
              return [
                pref,
                shor
              ];
            }
          }
        }
      },
      processResource: function (params) {
        var resource = '';
        if ($rootScope.godmode) {
          /*if (empty != "") {
					return $rootScope.localgraph + this.processLocalResource(params);
				}//*/
          var host = params.a;
          var resource = '/' + params.b;
          var alphabet = [
              'c',
              'd',
              'e',
              'f',
              'g',
              'h',
              'i'
            ];
          for (var i = 0; i < alphabet.length; i++) {
            var letter = alphabet[i];
            if (params[letter] !== undefined) {
              resource += '/' + params[letter];
            }
          }
          var protocol = 'http:';
          $rootScope.localgraph = protocol + '//' + host;
          $rootScope.endpointgraph = [$rootScope.localgraph];
          $rootScope.endpoint = $rootScope.localgraph + '/sparql';
          $rootScope.owlgraph = $rootScope.localgraph;
          $rootScope.owlendpoint = $rootScope.endpoint;
        } else {
          resource = this.processLocalResource(params);
        }
        return $rootScope.localgraph + resource;
      },
      processLocalResource: function (params) {
        var resource = '';
        var alphabet = [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i'
          ];
        for (var i = 0; i < alphabet.length; i++) {
          var letter = alphabet[i];
          if (params[letter] !== undefined) {
            resource += '/' + params[letter];
          }
        }
        return resource;
      }
    };
  }
]);
angular.module('ldv.services.entity', [
  'ldv.services.UrlService',
  'ldv.services.jassa'
]).factory('Entity', [
  '$rootScope',
  'UrlService',
  '$q',
  'JassaService',
  function ($rootScope, UrlService, $q, JassaService) {
    return {
      triples: function (resource, prdicates, reverse) {
        // XXX prdicates not used
        if (reverse === undefined) {
          reverse = false;
        }
        var entityUrl = resource;
        if (LDViewer.getConfig('encodegraph') == true) {
          entityUrl = encodeURI(entityUrl);
        }
        var rdf = Jassa.rdf;
        var about = $('[about]').attr('about');
        //XXX this is ugly
        var query = '';
        var labelquery = '';
        var showlabels = $rootScope.showLabels;
        if (!reverse) {
          query = 'SELECT DISTINCT * where {<' + entityUrl + '> ?p ?o}';
          if (showlabels) {
            labelqueries = [
              'SELECT DISTINCT ?p as ?x ?pl ?l WHERE { ?p ?pl ?l . {' + query + '}',
              'SELECT DISTINCT ?o as ?x ?pl ?l WHERE { ?o ?pl ?l . {' + query + '}'
            ];
          }
        } else {
          query = 'SELECT DISTINCT ?p ?s WHERE {?su ?p <' + entityUrl + '> .FILTER (?p != <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>). {SELECT ?s WHERE {?s ?p <' + entityUrl + '>} LIMIT 3 } }';
        }
        var assignLabels = this.assignLabels;
        var status = LDViewer.addStatus('Fetching data', '<span class="glyphicon glyphicon-download-alt"></span>');
        var request = JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph()).then(function (resultset) {
            var labelnodes = [];
            var predicates = {};
            if (status)
              status.delete();
            var sVar = rdf.NodeFactory.createVar('s');
            var pVar = rdf.NodeFactory.createVar('p');
            var oVar = rdf.NodeFactory.createVar('o');
            while (resultset.hasNext()) {
              var binding = resultset.nextBinding();
              //console.log(binding);
              var prop = binding.get(pVar);
              if (showlabels)
                labelnodes.push(prop);
              var predid = prop.uri;
              var obj = {};
              if (!reverse) {
                obj = binding.get(oVar);
                predid = 'i-' + predid;
                prop.forward = true;
              } else {
                obj = binding.get(sVar);
                predid = 'o-' + predid;
                prop.forward = false;
              }
              if (showlabels)
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
            if (showlabels)
              assignLabels(labelqueries, labelnodes);
            //console.log("LOADED INQE");
            var ret = {};
            ret.predicates = predicates;
            if (showlabels)
              ret.labelnodes = labelnodes;
            if (showlabels)
              ret.labelqueries = labelqueries;
            return predicates;
          }, function (error) {
            if (status)
              status.delete();
            //alert(JSON.stringify(error));
            return error;
          }, function (update) {
            return update;
          });
        ;
        return request;
      },
      labelledQuery: function (q, labelvars) {
        if ($rootScope.showLabels) {
          for (var i = 0; i < $rootScope.labelPrefs; i++) {
          }
        }
      },
      assignLabels: function (queries, nodes) {
        console.log('assigning labels');
        //(function(queries, nodes) {
        if ($rootScope.showLabels) {
          var rdf = Jassa.rdf;
          var labelPrefs = $rootScope.labelPrefs;
          var status = LDViewer.addStatus('Fetching labels', '<span class="glyphicon glyphicon-download-alt"></span>');
          var promises = [];
          for (var q = 0; q < queries.length; q++) {
            query = queries[q];
            query = query + '. FILTER(';
            for (var j = 0; j < labelPrefs.length; j++) {
              var addx = '(?pl = <' + labelPrefs[j] + '>)';
              if (j < labelPrefs.length - 1) {
                addx += ' || ';
              }
              query += addx;
            }
            query += ')}';
            console.log(query);
            //*/
            /*
					var statusobj = {"icon": '<span class="glyphicon glyphicon-download-alt"></span>', "text": "Fetching labels"};
					var status = LDViewer.addStatus(statusobj);
					//*/
            var promise = JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph()).then(function (resultset) {
                var labelmap = {};
                var xVar = rdf.NodeFactory.createVar('x');
                var plVar = rdf.NodeFactory.createVar('pl');
                var lVar = rdf.NodeFactory.createVar('l');
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
                for (var i = 0; i < nodes.length; i++) {
                  var node = nodes[i];
                  if (node.uri && labelmap[node.uri]) {
                    var labels = labelmap[node.uri];
                    if (labels && labels.length > 0)
                      node.labelNodes = labels;
                  }
                }  //$rootScope.$apply();
              }, function (fail) {
                if (status)
                  status.delete();
              });
            ;
            promises.push(promise);
            $q.all(promises).then(function (promisemap) {
              if (status)
                status.delete();
            });
            ;
          }
        }  //})(queries, nodes);
      },
      reversePredicates: function (resource, prdicates) {
        var rdf = Jassa.rdf;
        var query = 'SELECT DISTINCT ?p WHERE {?s ?p <' + resource + '>.}';
        var labelqueries = ['SELECT DISTINCT ?p as ?x ?pl ?l WHERE { ?p ?pl ?l . {' + query + '}'];
        var assignLabels = this.assignLabels;
        var status = LDViewer.addStatus('Fetching reverse predicates', '<span class="glyphicon glyphicon-download-alt"></span>');
        return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph()).then(function (resultset) {
          var predicates = {};
          if (status)
            status.delete();
          var pVar = rdf.NodeFactory.createVar('p');
          var labelnodes = [];
          while (resultset.hasNext()) {
            var binding = resultset.nextBinding();
            //console.log(binding);
            var prop = binding.get(pVar);
            labelnodes.push(prop);
            var predid = prop.uri;
            var obj = {};
            obj = {};
            predid = 'o-' + predid;
            prop.forward = false;
            var subj = resource;
            var triple = new rdf.Triple(subj, prop, obj);
            if (predicates[predid] === undefined) {
              predicates[predid] = prop;
              var pred = predicates[predid];
              pred.predid = predid;
              pred.values = [];
            }  //pred.values.push(obj);
          }
          assignLabels(labelqueries, labelnodes);
          console.log('LOADED INQE');
          return predicates;
        }, function (error) {
          if (status)
            status.delete();
        }, function (update) {
        });
        ;
      },
      loadReverseValues: function (resource, property, limit, offset) {
        var rdf = Jassa.rdf;
        var query = 'SELECT ?s WHERE {?s <' + property.uri + '> <' + resource.uri + '>} LIMIT ' + limit + ' OFFSET ' + offset;
        var labelqueries = ['SELECT DISTINCT ?s as ?x ?pl ?l WHERE { ?s ?pl ?l . {' + query + '}'];
        var assignLabels = this.assignLabels;
        var status = LDViewer.addStatus('Fetching data', '<span class="glyphicon glyphicon-download-alt"></span>');
        return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph()).then(function (resultset) {
          if (status)
            status.delete();
          var sVar = rdf.NodeFactory.createVar('s');
          var results = [];
          var labelnodes = [];
          while (resultset.hasNext()) {
            var binding = resultset.nextBinding();
            var subj = binding.get(sVar);
            labelnodes.push(subj);
            results.push(subj);
          }
          assignLabels(labelqueries, labelnodes);
          return results;
        }, function (error) {
          if (status)
            status.delete();
        }, function (update) {
        });
        ;
      },
      loadReverseValuesCount: function (resource, property) {
        var rdf = Jassa.rdf;
        var query = 'SELECT COUNT(?s) AS ?c WHERE {?s <' + property.uri + '> <' + resource.uri + '>}';
        return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph()).then(function (resultset) {
          var sVar = rdf.NodeFactory.createVar('c');
          var results = [];
          while (resultset.hasNext() && results.length == 0) {
            var binding = resultset.nextBinding();
            results.push(binding.get(sVar));
          }
          return results;
        });
        ;
      },
      relationInstances: function (relationURL, number) {
        if (!number) {
          number = 100;
        }
        var rdf = Jassa.rdf;
        var query = 'SELECT DISTINCT ?s ?o where {?s <' + relationURL + '> ?o} LIMIT ' + number;
        var labelqueries = [
            'SELECT DISTINCT ?s as ?x ?pl ?l WHERE { ?s ?pl ?l . {' + query + '}',
            'SELECT DISTINCT ?o as ?x ?pl ?l WHERE { ?o ?pl ?l . {' + query + '}'
          ];
        var assignLabels = this.assignLabels;
        var status = LDViewer.addStatus('Fetching relation instances', '<span class="glyphicon glyphicon-download-alt"></span>');
        return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph()).then(function (resultset) {
          if (status)
            status.delete();
          var instances = [];
          var sVar = rdf.NodeFactory.createVar('s');
          //var pVar = rdf.NodeFactory.createVar("p");
          var oVar = rdf.NodeFactory.createVar('o');
          var labelnodes = [];
          while (resultset.hasNext()) {
            var binding = resultset.nextBinding();
            console.log(binding);
            var subj = binding.get(sVar);
            var obj = binding.get(oVar);
            labelnodes.push(subj);
            labelnodes.push(obj);
            var oneret = {
                'subj': subj,
                'obj': obj
              };
            instances.push(oneret);
            console.log(oneret);
          }
          assignLabels(labelqueries, labelnodes);
          console.log('relation instances loaded');
          return instances;
        }, function (error) {
          if (status)
            status.delete();
        }, function (update) {
        });
        ;
      },
      classInstances: function (classURL, number) {
        if (!number) {
          number = 100;
        }
        var rdf = Jassa.rdf;
        var query = 'SELECT DISTINCT ?s where {?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <' + classURL + '>} LIMIT ' + number;
        var labelqueries = ['SELECT DISTINCT ?s as ?x ?pl ?l WHERE { ?s ?pl ?l . {' + query + '}'];
        var assignLabels = this.assignLabels;
        var status = LDViewer.addStatus('Fetching class instances', '<span class="glyphicon glyphicon-download-alt"></span>');
        return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph()).then(function (resultset) {
          if (status)
            status.delete();
          var sVar = rdf.NodeFactory.createVar('s');
          var instances = [];
          var labelnodes = [];
          while (resultset.hasNext()) {
            var binding = resultset.nextBinding();
            var subj = binding.get(sVar);
            labelnodes.push(subj);
            instances.push(subj);
          }
          assignLabels(labelqueries, labelnodes);
          console.log('class instances loaded');
          return instances;
        }, function (error) {
          if (status)
            status.delete();
        }, function (update) {
        });
        ;
      },
      numberClassInstances: function (classURL) {
        var rdf = Jassa.rdf;
        var query = 'SELECT COUNT(?x) AS ?c WHERE {?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <' + classURL + '> }';
        return JassaService.select(query, UrlService.endpoint(), UrlService.endpointgraph()).then(function (resultset) {
          var cVar = rdf.NodeFactory.createVar('c');
          while (resultset.hasNext()) {
            var count = resultset.nextBinding().get(cVar).literalLabel.val;
          }
          return count;
        });
        ;
      }
    };
  }
]);
;
angular.module('ldv.services.jassa', []).factory('JassaService', [
  '$q',
  '$rootScope',
  function ($q, $rootScope) {
    return {
      select: function (query, endpoint, endpointgraph, timeout) {
        var deferred = $q.defer();
        if (!timeout) {
          timeout = 60000;
        }
        var serve = Jassa.service;
        var sparqlService = new serve.SparqlServiceHttp(endpoint, endpointgraph);
        var qe = sparqlService.createQueryExecution(query);
        qe.setTimeout(timeout);
        qe.execSelect().done(function (resultset) {
          $rootScope.$apply(function () {
            deferred.resolve(resultset);
          });
        }).fail(function (error) {
          $rootScope.$apply(function () {
            deferred.reject(error);
          });
        });
        ;
        return deferred.promise;
      }
    };
  }
]);
;
angular.module('ldv.services.languages', []).factory('LanguageService', [
  '$rootScope',
  function ($rootScope) {
    return {
      languages: {
        'ab': {
          'name': 'Abkhaz',
          'nativeName': '\u0430\u04a7\u0441\u0443\u0430'
        },
        'aa': {
          'name': 'Afar',
          'nativeName': 'Afaraf'
        },
        'af': {
          'name': 'Afrikaans',
          'nativeName': 'Afrikaans'
        },
        'ak': {
          'name': 'Akan',
          'nativeName': 'Akan'
        },
        'sq': {
          'name': 'Albanian',
          'nativeName': 'Shqip'
        },
        'am': {
          'name': 'Amharic',
          'nativeName': '\u12a0\u121b\u122d\u129b'
        },
        'ar': {
          'name': 'Arabic',
          'nativeName': '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'
        },
        'an': {
          'name': 'Aragonese',
          'nativeName': 'Aragon\xe9s'
        },
        'hy': {
          'name': 'Armenian',
          'nativeName': '\u0540\u0561\u0575\u0565\u0580\u0565\u0576'
        },
        'as': {
          'name': 'Assamese',
          'nativeName': '\u0985\u09b8\u09ae\u09c0\u09af\u09bc\u09be'
        },
        'av': {
          'name': 'Avaric',
          'nativeName': '\u0430\u0432\u0430\u0440 \u043c\u0430\u0446\u04c0, \u043c\u0430\u0433\u04c0\u0430\u0440\u0443\u043b \u043c\u0430\u0446\u04c0'
        },
        'ae': {
          'name': 'Avestan',
          'nativeName': 'avesta'
        },
        'ay': {
          'name': 'Aymara',
          'nativeName': 'aymar aru'
        },
        'az': {
          'name': 'Azerbaijani',
          'nativeName': 'az\u0259rbaycan dili'
        },
        'bm': {
          'name': 'Bambara',
          'nativeName': 'bamanankan'
        },
        'ba': {
          'name': 'Bashkir',
          'nativeName': '\u0431\u0430\u0448\u04a1\u043e\u0440\u0442 \u0442\u0435\u043b\u0435'
        },
        'eu': {
          'name': 'Basque',
          'nativeName': 'euskara, euskera'
        },
        'be': {
          'name': 'Belarusian',
          'nativeName': '\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f'
        },
        'bn': {
          'name': 'Bengali',
          'nativeName': '\u09ac\u09be\u0982\u09b2\u09be'
        },
        'bh': {
          'name': 'Bihari',
          'nativeName': '\u092d\u094b\u091c\u092a\u0941\u0930\u0940'
        },
        'bi': {
          'name': 'Bislama',
          'nativeName': 'Bislama'
        },
        'bs': {
          'name': 'Bosnian',
          'nativeName': 'bosanski jezik'
        },
        'br': {
          'name': 'Breton',
          'nativeName': 'brezhoneg'
        },
        'bg': {
          'name': 'Bulgarian',
          'nativeName': '\u0431\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438 \u0435\u0437\u0438\u043a'
        },
        'my': {
          'name': 'Burmese',
          'nativeName': '\u1017\u1019\u102c\u1005\u102c'
        },
        'ca': {
          'name': 'Catalan; Valencian',
          'nativeName': 'Catal\xe0'
        },
        'ch': {
          'name': 'Chamorro',
          'nativeName': 'Chamoru'
        },
        'ce': {
          'name': 'Chechen',
          'nativeName': '\u043d\u043e\u0445\u0447\u0438\u0439\u043d \u043c\u043e\u0442\u0442'
        },
        'ny': {
          'name': 'Chichewa; Chewa; Nyanja',
          'nativeName': 'chiChe\u0175a, chinyanja'
        },
        'zh': {
          'name': 'Chinese',
          'nativeName': '\u4e2d\u6587 (Zh\u014dngw\xe9n), \u6c49\u8bed, \u6f22\u8a9e'
        },
        'cv': {
          'name': 'Chuvash',
          'nativeName': '\u0447\u04d1\u0432\u0430\u0448 \u0447\u04d7\u043b\u0445\u0438'
        },
        'kw': {
          'name': 'Cornish',
          'nativeName': 'Kernewek'
        },
        'co': {
          'name': 'Corsican',
          'nativeName': 'corsu, lingua corsa'
        },
        'cr': {
          'name': 'Cree',
          'nativeName': '\u14c0\u1426\u1403\u152d\u140d\u140f\u1423'
        },
        'hr': {
          'name': 'Croatian',
          'nativeName': 'hrvatski'
        },
        'cs': {
          'name': 'Czech',
          'nativeName': '\u010desky, \u010de\u0161tina'
        },
        'da': {
          'name': 'Danish',
          'nativeName': 'dansk'
        },
        'dv': {
          'name': 'Divehi; Dhivehi; Maldivian;',
          'nativeName': '\u078b\u07a8\u0788\u07ac\u0780\u07a8'
        },
        'nl': {
          'name': 'Dutch',
          'nativeName': 'Nederlands, Vlaams'
        },
        'en': {
          'name': 'English',
          'nativeName': 'English'
        },
        'eo': {
          'name': 'Esperanto',
          'nativeName': 'Esperanto'
        },
        'et': {
          'name': 'Estonian',
          'nativeName': 'eesti, eesti keel'
        },
        'ee': {
          'name': 'Ewe',
          'nativeName': 'E\u028begbe'
        },
        'fo': {
          'name': 'Faroese',
          'nativeName': 'f\xf8royskt'
        },
        'fj': {
          'name': 'Fijian',
          'nativeName': 'vosa Vakaviti'
        },
        'fi': {
          'name': 'Finnish',
          'nativeName': 'suomi, suomen kieli'
        },
        'fr': {
          'name': 'French',
          'nativeName': 'fran\xe7ais, langue fran\xe7aise'
        },
        'ff': {
          'name': 'Fula; Fulah; Pulaar; Pular',
          'nativeName': 'Fulfulde, Pulaar, Pular'
        },
        'gl': {
          'name': 'Galician',
          'nativeName': 'Galego'
        },
        'ka': {
          'name': 'Georgian',
          'nativeName': '\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8'
        },
        'de': {
          'name': 'German',
          'nativeName': 'Deutsch'
        },
        'el': {
          'name': 'Greek, Modern',
          'nativeName': '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac'
        },
        'gn': {
          'name': 'Guaran\xed',
          'nativeName': 'Ava\xf1e\u1ebd'
        },
        'gu': {
          'name': 'Gujarati',
          'nativeName': '\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0'
        },
        'ht': {
          'name': 'Haitian; Haitian Creole',
          'nativeName': 'Krey\xf2l ayisyen'
        },
        'ha': {
          'name': 'Hausa',
          'nativeName': 'Hausa, \u0647\u064e\u0648\u064f\u0633\u064e'
        },
        'he': {
          'name': 'Hebrew (modern)',
          'nativeName': '\u05e2\u05d1\u05e8\u05d9\u05ea'
        },
        'hz': {
          'name': 'Herero',
          'nativeName': 'Otjiherero'
        },
        'hi': {
          'name': 'Hindi',
          'nativeName': '\u0939\u093f\u0928\u094d\u0926\u0940, \u0939\u093f\u0902\u0926\u0940'
        },
        'ho': {
          'name': 'Hiri Motu',
          'nativeName': 'Hiri Motu'
        },
        'hu': {
          'name': 'Hungarian',
          'nativeName': 'Magyar'
        },
        'ia': {
          'name': 'Interlingua',
          'nativeName': 'Interlingua'
        },
        'id': {
          'name': 'Indonesian',
          'nativeName': 'Bahasa Indonesia'
        },
        'ie': {
          'name': 'Interlingue',
          'nativeName': 'Originally called Occidental; then Interlingue after WWII'
        },
        'ga': {
          'name': 'Irish',
          'nativeName': 'Gaeilge'
        },
        'ig': {
          'name': 'Igbo',
          'nativeName': 'As\u1ee5s\u1ee5 Igbo'
        },
        'ik': {
          'name': 'Inupiaq',
          'nativeName': 'I\xf1upiaq, I\xf1upiatun'
        },
        'io': {
          'name': 'Ido',
          'nativeName': 'Ido'
        },
        'is': {
          'name': 'Icelandic',
          'nativeName': '\xcdslenska'
        },
        'it': {
          'name': 'Italian',
          'nativeName': 'Italiano'
        },
        'iu': {
          'name': 'Inuktitut',
          'nativeName': '\u1403\u14c4\u1483\u144e\u1450\u1466'
        },
        'ja': {
          'name': 'Japanese',
          'nativeName': '\u65e5\u672c\u8a9e (\u306b\u307b\u3093\u3054\uff0f\u306b\u3063\u307d\u3093\u3054)'
        },
        'jv': {
          'name': 'Javanese',
          'nativeName': 'basa Jawa'
        },
        'kl': {
          'name': 'Kalaallisut, Greenlandic',
          'nativeName': 'kalaallisut, kalaallit oqaasii'
        },
        'kn': {
          'name': 'Kannada',
          'nativeName': '\u0c95\u0ca8\u0ccd\u0ca8\u0ca1'
        },
        'kr': {
          'name': 'Kanuri',
          'nativeName': 'Kanuri'
        },
        'ks': {
          'name': 'Kashmiri',
          'nativeName': '\u0915\u0936\u094d\u092e\u0940\u0930\u0940, \u0643\u0634\u0645\u064a\u0631\u064a\u200e'
        },
        'kk': {
          'name': 'Kazakh',
          'nativeName': '\u049a\u0430\u0437\u0430\u049b \u0442\u0456\u043b\u0456'
        },
        'km': {
          'name': 'Khmer',
          'nativeName': '\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a'
        },
        'ki': {
          'name': 'Kikuyu, Gikuyu',
          'nativeName': 'G\u0129k\u0169y\u0169'
        },
        'rw': {
          'name': 'Kinyarwanda',
          'nativeName': 'Ikinyarwanda'
        },
        'ky': {
          'name': 'Kirghiz, Kyrgyz',
          'nativeName': '\u043a\u044b\u0440\u0433\u044b\u0437 \u0442\u0438\u043b\u0438'
        },
        'kv': {
          'name': 'Komi',
          'nativeName': '\u043a\u043e\u043c\u0438 \u043a\u044b\u0432'
        },
        'kg': {
          'name': 'Kongo',
          'nativeName': 'KiKongo'
        },
        'ko': {
          'name': 'Korean',
          'nativeName': '\ud55c\uad6d\uc5b4 (\u97d3\u570b\u8a9e), \uc870\uc120\ub9d0 (\u671d\u9bae\u8a9e)'
        },
        'ku': {
          'name': 'Kurdish',
          'nativeName': 'Kurd\xee, \u0643\u0648\u0631\u062f\u06cc\u200e'
        },
        'kj': {
          'name': 'Kwanyama, Kuanyama',
          'nativeName': 'Kuanyama'
        },
        'la': {
          'name': 'Latin',
          'nativeName': 'latine, lingua latina'
        },
        'lb': {
          'name': 'Luxembourgish, Letzeburgesch',
          'nativeName': 'L\xebtzebuergesch'
        },
        'lg': {
          'name': 'Luganda',
          'nativeName': 'Luganda'
        },
        'li': {
          'name': 'Limburgish, Limburgan, Limburger',
          'nativeName': 'Limburgs'
        },
        'ln': {
          'name': 'Lingala',
          'nativeName': 'Ling\xe1la'
        },
        'lo': {
          'name': 'Lao',
          'nativeName': '\u0e9e\u0eb2\u0eaa\u0eb2\u0ea5\u0eb2\u0ea7'
        },
        'lt': {
          'name': 'Lithuanian',
          'nativeName': 'lietuvi\u0173 kalba'
        },
        'lu': {
          'name': 'Luba-Katanga',
          'nativeName': ''
        },
        'lv': {
          'name': 'Latvian',
          'nativeName': 'latvie\u0161u valoda'
        },
        'gv': {
          'name': 'Manx',
          'nativeName': 'Gaelg, Gailck'
        },
        'mk': {
          'name': 'Macedonian',
          'nativeName': '\u043c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438 \u0458\u0430\u0437\u0438\u043a'
        },
        'mg': {
          'name': 'Malagasy',
          'nativeName': 'Malagasy fiteny'
        },
        'ms': {
          'name': 'Malay',
          'nativeName': 'bahasa Melayu, \u0628\u0647\u0627\u0633 \u0645\u0644\u0627\u064a\u0648\u200e'
        },
        'ml': {
          'name': 'Malayalam',
          'nativeName': '\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02'
        },
        'mt': {
          'name': 'Maltese',
          'nativeName': 'Malti'
        },
        'mi': {
          'name': 'M\u0101ori',
          'nativeName': 'te reo M\u0101ori'
        },
        'mr': {
          'name': 'Marathi (Mar\u0101\u1e6dh\u012b)',
          'nativeName': '\u092e\u0930\u093e\u0920\u0940'
        },
        'mh': {
          'name': 'Marshallese',
          'nativeName': 'Kajin M\u0327aje\u013c'
        },
        'mn': {
          'name': 'Mongolian',
          'nativeName': '\u043c\u043e\u043d\u0433\u043e\u043b'
        },
        'na': {
          'name': 'Nauru',
          'nativeName': 'Ekakair\u0169 Naoero'
        },
        'nv': {
          'name': 'Navajo, Navaho',
          'nativeName': 'Din\xe9 bizaad, Din\xe9k\u02bceh\u01f0\xed'
        },
        'nb': {
          'name': 'Norwegian Bokm\xe5l',
          'nativeName': 'Norsk bokm\xe5l'
        },
        'nd': {
          'name': 'North Ndebele',
          'nativeName': 'isiNdebele'
        },
        'ne': {
          'name': 'Nepali',
          'nativeName': '\u0928\u0947\u092a\u093e\u0932\u0940'
        },
        'ng': {
          'name': 'Ndonga',
          'nativeName': 'Owambo'
        },
        'nn': {
          'name': 'Norwegian Nynorsk',
          'nativeName': 'Norsk nynorsk'
        },
        'no': {
          'name': 'Norwegian',
          'nativeName': 'Norsk'
        },
        'ii': {
          'name': 'Nuosu',
          'nativeName': '\ua188\ua320\ua4bf Nuosuhxop'
        },
        'nr': {
          'name': 'South Ndebele',
          'nativeName': 'isiNdebele'
        },
        'oc': {
          'name': 'Occitan',
          'nativeName': 'Occitan'
        },
        'oj': {
          'name': 'Ojibwe, Ojibwa',
          'nativeName': '\u140a\u14c2\u1511\u14c8\u142f\u14a7\u140e\u14d0'
        },
        'cu': {
          'name': 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic',
          'nativeName': '\u0469\u0437\u044b\u043a\u044a \u0441\u043b\u043e\u0432\u0463\u043d\u044c\u0441\u043a\u044a'
        },
        'om': {
          'name': 'Oromo',
          'nativeName': 'Afaan Oromoo'
        },
        'or': {
          'name': 'Oriya',
          'nativeName': '\u0b13\u0b21\u0b3c\u0b3f\u0b06'
        },
        'os': {
          'name': 'Ossetian, Ossetic',
          'nativeName': '\u0438\u0440\u043e\u043d \xe6\u0432\u0437\u0430\u0433'
        },
        'pa': {
          'name': 'Panjabi, Punjabi',
          'nativeName': '\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40, \u067e\u0646\u062c\u0627\u0628\u06cc\u200e'
        },
        'pi': {
          'name': 'P\u0101li',
          'nativeName': '\u092a\u093e\u0934\u093f'
        },
        'fa': {
          'name': 'Persian',
          'nativeName': '\u0641\u0627\u0631\u0633\u06cc'
        },
        'pl': {
          'name': 'Polish',
          'nativeName': 'polski'
        },
        'ps': {
          'name': 'Pashto, Pushto',
          'nativeName': '\u067e\u069a\u062a\u0648'
        },
        'pt': {
          'name': 'Portuguese',
          'nativeName': 'Portugu\xeas'
        },
        'qu': {
          'name': 'Quechua',
          'nativeName': 'Runa Simi, Kichwa'
        },
        'rm': {
          'name': 'Romansh',
          'nativeName': 'rumantsch grischun'
        },
        'rn': {
          'name': 'Kirundi',
          'nativeName': 'kiRundi'
        },
        'ro': {
          'name': 'Romanian, Moldavian, Moldovan',
          'nativeName': 'rom\xe2n\u0103'
        },
        'ru': {
          'name': 'Russian',
          'nativeName': '\u0440\u0443\u0441\u0441\u043a\u0438\u0439 \u044f\u0437\u044b\u043a'
        },
        'sa': {
          'name': 'Sanskrit (Sa\u1e41sk\u1e5bta)',
          'nativeName': '\u0938\u0902\u0938\u094d\u0915\u0943\u0924\u092e\u094d'
        },
        'sc': {
          'name': 'Sardinian',
          'nativeName': 'sardu'
        },
        'sd': {
          'name': 'Sindhi',
          'nativeName': '\u0938\u093f\u0928\u094d\u0927\u0940, \u0633\u0646\u068c\u064a\u060c \u0633\u0646\u062f\u06be\u06cc\u200e'
        },
        'se': {
          'name': 'Northern Sami',
          'nativeName': 'Davvis\xe1megiella'
        },
        'sm': {
          'name': 'Samoan',
          'nativeName': 'gagana faa Samoa'
        },
        'sg': {
          'name': 'Sango',
          'nativeName': 'y\xe2ng\xe2 t\xee s\xe4ng\xf6'
        },
        'sr': {
          'name': 'Serbian',
          'nativeName': '\u0441\u0440\u043f\u0441\u043a\u0438 \u0458\u0435\u0437\u0438\u043a'
        },
        'gd': {
          'name': 'Scottish Gaelic; Gaelic',
          'nativeName': 'G\xe0idhlig'
        },
        'sn': {
          'name': 'Shona',
          'nativeName': 'chiShona'
        },
        'si': {
          'name': 'Sinhala, Sinhalese',
          'nativeName': '\u0dc3\u0dd2\u0d82\u0dc4\u0dbd'
        },
        'sk': {
          'name': 'Slovak',
          'nativeName': 'sloven\u010dina'
        },
        'sl': {
          'name': 'Slovene',
          'nativeName': 'sloven\u0161\u010dina'
        },
        'so': {
          'name': 'Somali',
          'nativeName': 'Soomaaliga, af Soomaali'
        },
        'st': {
          'name': 'Southern Sotho',
          'nativeName': 'Sesotho'
        },
        'es': {
          'name': 'Spanish; Castilian',
          'nativeName': 'espa\xf1ol, castellano'
        },
        'su': {
          'name': 'Sundanese',
          'nativeName': 'Basa Sunda'
        },
        'sw': {
          'name': 'Swahili',
          'nativeName': 'Kiswahili'
        },
        'ss': {
          'name': 'Swati',
          'nativeName': 'SiSwati'
        },
        'sv': {
          'name': 'Swedish',
          'nativeName': 'svenska'
        },
        'ta': {
          'name': 'Tamil',
          'nativeName': '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd'
        },
        'te': {
          'name': 'Telugu',
          'nativeName': '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41'
        },
        'tg': {
          'name': 'Tajik',
          'nativeName': '\u0442\u043e\u04b7\u0438\u043a\u04e3, to\u011fik\u012b, \u062a\u0627\u062c\u06cc\u06a9\u06cc\u200e'
        },
        'th': {
          'name': 'Thai',
          'nativeName': '\u0e44\u0e17\u0e22'
        },
        'ti': {
          'name': 'Tigrinya',
          'nativeName': '\u1275\u130d\u122d\u129b'
        },
        'bo': {
          'name': 'Tibetan Standard, Tibetan, Central',
          'nativeName': '\u0f56\u0f7c\u0f51\u0f0b\u0f61\u0f72\u0f42'
        },
        'tk': {
          'name': 'Turkmen',
          'nativeName': 'T\xfcrkmen, \u0422\u04af\u0440\u043a\u043c\u0435\u043d'
        },
        'tl': {
          'name': 'Tagalog',
          'nativeName': 'Wikang Tagalog, \u170f\u1712\u1703\u1705\u1714 \u1706\u1704\u170e\u1713\u1704\u1714'
        },
        'tn': {
          'name': 'Tswana',
          'nativeName': 'Setswana'
        },
        'to': {
          'name': 'Tonga (Tonga Islands)',
          'nativeName': 'faka Tonga'
        },
        'tr': {
          'name': 'Turkish',
          'nativeName': 'T\xfcrk\xe7e'
        },
        'ts': {
          'name': 'Tsonga',
          'nativeName': 'Xitsonga'
        },
        'tt': {
          'name': 'Tatar',
          'nativeName': '\u0442\u0430\u0442\u0430\u0440\u0447\u0430, tatar\xe7a, \u062a\u0627\u062a\u0627\u0631\u0686\u0627\u200e'
        },
        'tw': {
          'name': 'Twi',
          'nativeName': 'Twi'
        },
        'ty': {
          'name': 'Tahitian',
          'nativeName': 'Reo Tahiti'
        },
        'ug': {
          'name': 'Uighur, Uyghur',
          'nativeName': 'Uy\u01a3urq\u0259, \u0626\u06c7\u064a\u063a\u06c7\u0631\u0686\u06d5\u200e'
        },
        'uk': {
          'name': 'Ukrainian',
          'nativeName': '\u0443\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430'
        },
        'ur': {
          'name': 'Urdu',
          'nativeName': '\u0627\u0631\u062f\u0648'
        },
        'uz': {
          'name': 'Uzbek',
          'nativeName': 'zbek, \u040e\u0437\u0431\u0435\u043a, \u0623\u06c7\u0632\u0628\u06d0\u0643\u200e'
        },
        've': {
          'name': 'Venda',
          'nativeName': 'Tshiven\u1e13a'
        },
        'vi': {
          'name': 'Vietnamese',
          'nativeName': 'Ti\u1ebfng Vi\u1ec7t'
        },
        'vo': {
          'name': 'Volap\xfck',
          'nativeName': 'Volap\xfck'
        },
        'wa': {
          'name': 'Walloon',
          'nativeName': 'Walon'
        },
        'cy': {
          'name': 'Welsh',
          'nativeName': 'Cymraeg'
        },
        'wo': {
          'name': 'Wolof',
          'nativeName': 'Wollof'
        },
        'fy': {
          'name': 'Western Frisian',
          'nativeName': 'Frysk'
        },
        'xh': {
          'name': 'Xhosa',
          'nativeName': 'isiXhosa'
        },
        'yi': {
          'name': 'Yiddish',
          'nativeName': '\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9'
        },
        'yo': {
          'name': 'Yoruba',
          'nativeName': 'Yor\xf9b\xe1'
        },
        'za': {
          'name': 'Zhuang, Chuang',
          'nativeName': 'Sa\u026f cue\u014b\u0185, Saw cuengh'
        }
      }
    };
  }
]);
angular.module('ldv.services.preview', ['ldv.services.UrlService']).factory('Preview', [
  '$http',
  'UrlService',
  function ($http, UrlService) {
    return {
      getPreview: function (rurl, mappings, scope) {
        if (scope.previewSemaphore === undefined) {
          scope.previewSemaphore = 0;
        }
        var uri;
        if (rurl.slice(0, UrlService.localgraph().length) == UrlService.localgraph()) {
          uri = rurl;
        } else {
          uri = UrlService.localgraph() + rurl;
        }
        var baseq = 'SELECT DISTINCT ?p ?o {<' + uri + '> ?p ?o';
      },
      getProperty: function (rurl, prop, scope, graph, endpoint) {
        if (scope.previewSemaphore === undefined) {
          scope.previewSemaphore = 0;
        }
        var vals = [];
        var values = [];
        var uri;
        if (rurl.slice(0, graph.length) == graph) {
          uri = rurl;
        } else {
          uri = graph + rurl;
        }
        var query = 'SELECT DISTINCT ?p WHERE {<' + uri + '> <' + prop + '> ?p}';
        var rdf = Jassa.rdf;
        var serve = Jassa.service;
        var sparqlService = new serve.SparqlServiceHttp(endpoint, ['http://dbpedia.org']);
        var inqe = sparqlService.createQueryExecution(query);
        inqe.setTimeout(60000);
        var pVar = rdf.NodeFactory.createVar('p');
        //scope.previewSemaphore ++;
        inqe.execSelect().done(function (resultset) {
          scope.previewSemaphore--;
          while (resultset.hasNext()) {
            var binding = resultset.nextBinding();
            var prop = binding.get(pVar);
            vals.push(prop);
          }
          scope.$digest();
        }).fail(function (err) {
          scope.previewSemaphore--;
          console.log('Preview Query FAILED');
        });
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
  }
]);
angular.module('ldv.services.search', ['ldv.services.UrlService']).factory('Search', [
  'UrlService',
  '$rootScope',
  '$q',
  function (UrlService, $rootScope, $q) {
    return {
      search: function (term, number) {
        var deferred = $q.defer();
        if (!number) {
          number = 10;
        }
        number = 25;
        var rdf = Jassa.rdf;
        var serve = Jassa.service;
        var sparqlService = new serve.SparqlServiceHttp(UrlService.endpoint(), UrlService.endpointgraph());
        var searchfield = 'http://www.w3.org/2000/01/rdf-schema#label';
        //var query = 'SELECT DISTINCT ?s ?l where {?s <'+searchfield+'> ?l . FILTER(CONTAINS(LCASE(STR(?l)), LCASE("'+term+'")))} LIMIT '+number;
        //var query = 'SELECT DISTINCT ?s ?l where {?s <'+searchfield+'> ?l . FILTER(bif:contains(?l, "'+term+'"))} LIMIT '+number;
        term = term.replace(/\s/g, '_');
        //alert(term);
        var query = 'select ?s ?l {?s <' + searchfield + '> ?l . ?l bif:contains "' + term + '" . filter(contains(str(?s), "http://dbpedia.org/"))} LIMIT ' + number;
        //var query = 'SELECT DISTINCT ?s WHERE {?s ?p ?o . FILTER(CONTAINS
        var qe = sparqlService.createQueryExecution(query);
        qe.setTimeout(180000);
        var sVar = rdf.NodeFactory.createVar('s');
        //var pVar = rdf.NodeFactory.createVar("p");
        var lVar = rdf.NodeFactory.createVar('l');
        results = [];
        qe.execSelect().done(function (resultset) {
          $rootScope.$apply(function () {
            var predicates = {};
            var hasresults = false;
            while (resultset.hasNext()) {
              var binding = resultset.nextBinding();
              var subj = binding.get(sVar);
              var label = binding.get(lVar);
              var beginuri = subj.uri.slice(0, UrlService.localgraph().length);
              if (beginuri == UrlService.localgraph() && label.literalLabel) {
                var ldist = levenshtein(label.literalLabel.lex, term);
                var obj = {
                    'uri': subj,
                    'dist': ldist,
                    'label': label
                  };
                results.push(obj);
              }
            }
            results.sort(function (a, b) {
              return a.dist - b.dist;
            });
            //console.log(results);
            deferred.resolve(results);
          });
        }).fail(function (err) {
          $rootScope.$apply(function () {
            console.log('search query failed');
            deferred.reject('searching with SPARQL failed');
          });
        });
        ;
        function levenshtein(a, b) {
          /* copyright: andrew hedges
						http://andrew.hedges.name/
					*/
          var cost;
          // get values
          var m = a.length;
          var n = b.length;
          // make sure a.length >= b.length to use O(min(n,m)) space, whatever that is
          if (m < n) {
            var c = a;
            a = b;
            b = c;
            var o = m;
            m = n;
            n = o;
          }
          var r = new Array();
          r[0] = new Array();
          for (var c = 0; c < n + 1; c++) {
            r[0][c] = c;
          }
          for (var i = 1; i < m + 1; i++) {
            r[i] = new Array();
            r[i][0] = i;
            for (var j = 1; j < n + 1; j++) {
              cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
              r[i][j] = levenshtein_minimator(r[i - 1][j] + 1, r[i][j - 1] + 1, r[i - 1][j - 1] + cost);
            }
          }
          return r[m][n];
        }
        ;
        function levenshtein_minimator(x, y, z) {
          if (x < y && x < z)
            return x;
          if (y < x && y < z)
            return y;
          return z;
        }
        ;
        return deferred.promise;
      }
    };
  }
]);
;
angular.module('ldv.services', [
  'ldv.services.jassa',
  'ldv.services.UrlService',
  'ldv.services.preview',
  'ldv.services.entity',
  'ldv.services.search',
  'ldv.services.spotlight',
  'ldv.services.taf',
  'ldv.services.languages'
]);
angular.module('ldv.services.spotlight', []).factory('Spotlight', [
  '$http',
  '$rootScope',
  function ($http, $rootScope) {
    return {
      annotate: function (text) {
        delete $http.defaults.headers.common['X-Requested-With'];
        var endpoint = $rootScope.spotlightendpoint;
        $http.get(endpoint, 'text=' + text).success(function (data, status, headers, config) {
        }).error(function (data, status, headers, config) {
        });
      },
      annotate_async: function (text, callback, coming_through) {
        delete $http.defaults.headers.common['X-Requested-With'];
        var endpoint = $rootScope.spotlightendpoint;
        $http.get(endpoint + '?text=' + encodeURIComponent(text)).success(function (data, status, headers, config) {
          callback(data, coming_through);
        }).error(function (data, status, headers, config) {
          alert('Annotation error');
          callback(undefined, coming_through);
        });
      }
    };
  }
]);
;
angular.module('ldv.services.taf', []).factory('TafService', [
  '$rootScope',
  function ($rootScope) {
    return {
      onPredicateChange: function (about, predicates) {
        if (predicates !== undefined) {
          this.bindTaf(about, predicates);
          for (var id in predicates) {
            for (var i = 0; i < predicates[id].values.length; i++) {
              if (predicates[id].forward) {
                var val = predicates[id].values[i];
                if (val.literalLabel !== undefined && val.literalLabel.lang !== undefined && val.literalLabel.lang !== '') {
                  LDViewer.newAvailableLanguage(val.literalLabel.lang);
                }
              }
            }
          }
        }
      },
      bindTaf: function (about, predicates) {
        var actions = this.getActions();
        for (var key in predicates) {
          var predicate = predicates[key];
          this.bindTafPredicate(about, predicate, actions);
        }
      },
      bindTafPredicate: function (about, predicate, actions) {
        if (!actions)
          actions = this.getActions();
        for (var j = 0; j < predicate.values.length; j++) {
          var val = predicate.values[j];
          if (val.taf === undefined) {
            val.taf = [];
            for (var k = 0; k < actions.length; k++) {
              var subk = actions[k];
              if (subk.check(about, predicate, val)) {
                var instance = subk.factory(about, predicate, val);
                if (instance && instance.display) {
                  val.taf.push(instance);
                } else if (instance.execute) {
                  instance.execute(about, predicate, val);
                }
              }  /*
							try {
								var actionInstance = new subk(about, predicate, val);
								val.taf.push(actionInstance);
							} catch (err) {
								//console.log(err);
							}
							//*/
            }
          }
        }
      },
      getActions: function () {
        return Taf.actions;
      }  /*getActions:				function() {
				console.log("getting actions");
				var actions = [LDViewer.Action];
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
			}//*/
    };
  }
]);
;
LDViewer.taf = {};
LDViewer.taf.ActionFactory = Class.create({
  check: function (about, predicate, value) {
  },
  action: LDViewer.taf.Action,
  factory: function (about, predicate, value) {
    var instance = new this.action(about, predicate, value);
    if (instance.description === undefined && this.legend && this.legend.description) {
      instance.description = this.legend.description;
    }
    return instance;
  }
});
LDViewer.taf.Action = Class.create({
  initialize: function (about, predicate, value) {
  },
  execute: function () {
  }
});
;
LDViewer.taf.ActionGroupFactory = Class.create(LDViewer.taf.ActionFactory, {
  group: [],
  action: Class.create(LDViewer.taf.Action, {}),
  factory: function (about, predicate, value) {
    var instance = new this.action(about, predicate, value);
    instance.actions = [];
    for (var i = 0; i < this.group.length; i++) {
      var memberInstance = new this.group[i](about, predicate, value);
      if (memberInstance.check(about, predicate, value)) {
        instance.actions.push(memberInstance.factory(about, predicate, value));
      }
    }
    return instance;
  }
});
LDViewer.taf.ActionGroup = Class.create(LDViewer.taf.Action, { actions: [] });
var Taf = LDViewer.taf;
Taf.actions = [];
Taf.addAction = function (action) {
  if (action) {
    Taf.actions.push(new action());
  }
};
////////////////////////////////////////////////////////////////////
var ldvCompile = angular.module('ldv.compile', []);
ldvCompile.directive('compile', [
  '$compile',
  function ($compile) {
    return function (scope, element, attrs) {
      scope.$watch(function (scope) {
        return scope.$eval(attrs.compile);
      }, function (value) {
        element.html(value);
        $compile(element.contents())(scope);
      });
    };
  }
]);
var filterModule = angular.module('ldv.filters', []);
filterModule.filter('valueFilter', function () {
  return function (input, query) {
    if (!query) {
    }
    if (!query) {
      return input;
    } else {
      query = query.toLowerCase();
      var result = [];
      //result.push(input[0]);
      angular.forEach(input, function (value) {
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
				} else //*/
        if (label !== undefined && label.toLowerCase().indexOf(query) != -1)
          result.push(value);
      });
      return result;
    }
  };
});
filterModule.filter('predicateFilter', function () {
  return function (input, query) {
    if (!query)
      return input;
    query = query.toLowerCase();
    var result = {};
    angular.forEach(input, function (predicate) {
      var label = predicate.lex.toLowerCase();
      if (label.indexOf(query) != -1) {
        result[predicate.predid] = predicate;
      }  /*else if (predicate.uri.toLowerCase().indexOf(query) != -1) {
				result.push(predicate);
			}*/
    });
    return result;
  };
});
filterModule.filter('predicateValueFilter', function () {
  //XXX maybe merge with previous filter
  return function (input, query) {
    if (!query) {
      return input;
    }
    query = query.toLowerCase();
    var result = {};
    angular.forEach(input, function (predicate) {
      var hasvalues = false;
      for (var i = 0; i < predicate.values.length; i++) {
        //simulates value filter
        var label = predicate.values[i].lex;
        if (label === undefined && predicate.values[i].literalLabel !== undefined) {
          label = predicate.values[i].literalLabel.lex;
        }
        if (label !== undefined && label.toLowerCase().indexOf(query) != -1) {
          hasvalues = true;
        }  //*/
      }
      if (hasvalues) {
        result[predicate.predid] = predicate;
      }
    });
    return result;
  };
});
filterModule.filter('languageFilter', function () {
  return function (input, primary, fallback) {
    if (input && (!primary || !fallback || input.length < 2)) {
    }
    //else{
    if (input === undefined || input.length < 2) {
      return input;
    } else {
      var result = [];
      //result.push(input[0]);
      var breek = false;
      var primarylanga = false;
      angular.forEach(input, function (predval) {
        if (!breek) {
          if (predval.uri !== undefined) {
            result.push(predval);
          } else if (predval.literalLabel !== undefined) {
            if (predval.literalLabel.lang == 'en') {
            }
            if (predval.literalLabel.lang === undefined || predval.literalLabel.lang == '') {
              result.push(predval);
            } else {
              if (predval.literalLabel.lang == primary) {
                if (!primarylanga) {
                  for (var i = 0; i < result.length; i++) {
                    var res = result[i];
                    if (res.literalLabel !== undefined && res.literalLabel.lang !== undefined && res.literalLabel.lang != primary) {
                      result.splice(i, 1);
                      i--;
                    }
                  }
                }
                result.push(predval);
                primarylanga = true;  //console.log(JSON.stringify(predval) + " :: "+primary+" : "+fallback+" : "+predval.literalLabel.lang);
                                      //breek = true;
              } else if (result.length == 0 && predval.literalLabel.lang == fallback && !primarylanga) {
                result.push(predval);  //console.log(fallback+" : "+predval.literalLabel.lang);
              } else {
              }
            }
          }
        }
      });
      return result;
    }
    ;
  };
});
filterModule.filter('actionFilter', function () {
  return function (actions, about, pred, val) {
    if (!pred || !val)
      return [];
    var result = [];
    angular.forEach(actions, function (action) {
      if (action.autobind !== undefined && action.autobind(about, pred, val)) {
        result.push(action);
      }
    });
    return result;
  };
});
var nodeModule = angular.module('ldv.table.displayNode', [
    'ldv.compile',
    'ldv.filters',
    'ldv.services.UrlService',
    'ldv.templates.tripletable'
  ]);
nodeModule.directive('displayNode', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    template: '<span compile="nodedisplay"></span>',
    controller: 'DisplayNodeCtrl',
    scope: {
      node: '=',
      primarylang: '=',
      fallbacklang: '=',
      settings: '=',
      showlanguage: '='
    }
  };
}).controller('DisplayNodeCtrl', [
  '$scope',
  'UrlService',
  '$rootScope',
  '$filter',
  function ($scope, UrlService, $rootScope, $filter) {
    if ($scope.settings === undefined) {
    }
    if (!$scope.showlanguage) {
      $scope.showlanguage = true;
    }
    $scope.updatePlainLiteral = function (node) {
      var suffix = '<span class="valuetype">@' + $scope.node.literalLabel.lang + '</span>';
      var label = $scope.node.literalLabel.val;
      if ($scope.node.literalLabel.lex === undefined) {
        $scope.node.literalLabel.lex = label;
      } else {
        label = $scope.node.literalLabel.lex;
      }
      if ($scope.showlanguage) {
        label += ' ' + suffix;
      }
      $scope.nodedisplay = label;
    };
    //alert(JSON.stringify($scope.prefixes));
    $scope.updateDisplay = function () {
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
            label = '<span class="rdf-prefix">' + prefshor[0] + ':</span>' + prefshor[1];
          }
          lex = prefshor[0] + ':' + prefshor[1];
        }
        if ($scope.node.displayLabel && $rootScope.showLabels) {
          label = $scope.node.displayLabel;
          lex = label;
        } else if ($scope.node.labelNodes && $rootScope.showLabels) {
          //label = '<span ng-repeat="n in node.labelNodes | languageFilter:primarylang:fallbacklang"><span display-node node="n" primarylang="primarylang" fallbacklang="fallbacklang" settings="settings" showlanguage="false"></span></span>';
          var filtlabel = $filter('languageFilter')($scope.node.labelNodes, $scope.primarylang, $scope.fallbacklang);
          if (filtlabel && filtlabel.length > 0) {
            label = filtlabel[0].literalLabel.val;
            lex = label;
          }
        }
        var urlobj = UrlService.makeUrl($scope.node.uri);
        url = urlobj.uri;
        var args = '';
        if (urlobj.local) {
          args += ' dbpv-preview';
        }
        if ($scope.node.nofollow) {
          args += ' rel="nofollow"';
        }
        var display = '<a href="' + url + '"' + args + '>' + label + '</a>';
        if ($scope.node.forward !== undefined && $scope.node.forward == false) {
          display = 'is ' + display + ' of';
        }
        $scope.node.lex = lex;
        $scope.nodedisplay = display;
      } else if ($scope.node.literalLabel !== undefined) {
        var label = '';
        var suffix = '';
        //$scope.nodedisplay = $scope.node.literalLabel.lex;
        if ($scope.node.literalLabel.dtype === undefined && $scope.node.literalLabel.lang !== undefined) {
          $scope.updatePlainLiteral($scope.node);
          $scope.$watch('node.literalLabel.lex', function (newlex) {
            $scope.updatePlainLiteral($scope.node);
          });
        } else if ($scope.node.literalLabel.dtype !== undefined) {
          suffix = $scope.node.literalLabel.dtype.datatypeUri;
          var prefshor = UrlService.prefixify(suffix);
          if (prefshor !== undefined && prefshor.length > 1) {
            suffix = prefshor[0] + ':' + prefshor[1];
          }
          label = $scope.node.literalLabel.lex;
          if ($scope.node.literalLabel.lex === undefined) {
            $scope.node.literalLabel.lex = label;
          }
          if (suffix !== undefined) {
            label = label + '<span class="valuetype"> (' + suffix + ')</span>';
          }
        }
        $scope.nodedisplay = label;
      }
    };
    $scope.updateDisplay();
    if ($rootScope.showLabels) {
      $scope.$watch('node.labelNodes', function (node) {
        $scope.updateDisplay();
      });
      $scope.$watch('primarylang+fallbacklang', function (x) {
        $scope.updateDisplay();
      });
    }
    $scope.updateTypedLiteral = function (node) {
    };
  }
]);
;
var tripleTableModule = angular.module('ldv.table', [
    'ldv.table.displayNode',
    'ldv.table.displayValues',
    'ldv.ui.filters',
    'ldv.services.taf',
    'ldv.services.entity',
    'ldv.templates.tripletable'
  ]);
tripleTableModule.directive('displayPredicates', function () {
  return {
    restrict: 'EA',
    replace: false,
    transclude: false,
    scope: {
      about: '=',
      primarylang: '=',
      fallbacklang: '='
    },
    templateUrl: 'triple-table/displayPredicates/displayPredicates.html',
    controller: 'DisplayPredicatesCtrl',
    link: function (scope, element, attrs) {
      //alert("linking");
      console.log('linking');
    }
  };
}).controller('DisplayPredicatesCtrl', [
  '$scope',
  '$timeout',
  '$filter',
  'Entity',
  'TafService',
  '$rootScope',
  '$q',
  function ($scope, $timeout, $filter, Entity, TafService, $rootScope, $q) {
    $scope.sortPredicates = function (item) {
      return item.predid;
    };
    $scope.load = function () {
      //alert("controlling");
      //var deferred = $q.defer();
      $scope.predicates = {};
      //$rootScope.entitySemaphore ++;
      var forwardpromise = Entity.triples($scope.about.uri, $scope.predicates);
      /*
				.then(
					function(result) {
						jQuery.extend($scope.predicates, result);
						
						$rootScope.entitySemaphore --;
					},
					function(error) {
						$rootScope.entitySemaphore --;
					},
					function(update) {
					
					}
				)
			;
			//*/
      /*
			$scope.$watch('predicates', function(p) {
				TafService.onPredicateChange($scope.about, $scope.predicates);
			},true);
			//*/
      $scope.reversepredicates = {};
      //$rootScope.entitySemaphore ++;
      var reversepromise = Entity.reversePredicates($scope.about.uri, $scope.reversepredicates);
      /*
				.then(
					function(result) {
						//TafService.onPredicateChange($scope.about, $scope.reversepredicates);
						jQuery.extend($scope.predicates, result);
						$rootScope.entitySemaphore --;
					},
					function(error) {
						$rootScope.entitySemaphore --;
					},
					function(update) {
					
					}
				)
			;
			//*/
      $rootScope.entitySemaphore++;
      $rootScope.loadSuccess();
      $q.all([
        forwardpromise,
        reversepromise
      ]).then(function (resultmap) {
        //alert(JSON.stringify(resultmap));
        jQuery.extend($scope.predicates, resultmap[0]);
        jQuery.extend($scope.predicates, resultmap[1]);
        //*/
        var empty = true;
        for (var key in $scope.predicates) {
          empty = false;
          break;
        }
        if (empty) {
          (function (uri) {
            $rootScope.loadFailed('No information available for ' + $scope.about.uri);
            $scope.showFilter = false;
          }($scope.about.uri));
        } else {
          $rootScope.loadSuccess();
          $scope.doTaf = true;
          $scope.showFilters = true;
        }
        $rootScope.entitySemaphore--;
      }, function (errormap) {
        (function (uri) {
          $rootScope.serverError('Server Error');
          $rootScope.entitySemaphore--;
          $scope.showFilters = false;
        }($scope.about.uri));
      }, function (updatemap) {
      });
      ;
    };
    $scope.$watch('doTaf', function (doTaf) {
      if (doTaf) {
        TafService.onPredicateChange($scope.about, $scope.predicates);
      }
    });
    $scope.doTaf = false;
    $scope.load();
  }
]);
;
tripleTableModule.directive('displayPredicate', function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: false,
    scope: {
      about: '=',
      predicate: '=',
      valfilter: '=',
      primarylang: '=',
      fallbacklang: '='
    },
    templateUrl: 'triple-table/displayPredicates/displayPredicate.html'
  };
});
;
tripleTableModule.directive('displayReversePredicate', function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: false,
    scope: {
      about: '=',
      predicate: '=',
      valfilter: '=',
      primarylang: '=',
      fallbacklang: '='
    },
    templateUrl: 'triple-table/displayPredicates/displayReversePredicate.html'
  };
});
;
var valuesModule = angular.module('ldv.table.displayValues', [
    'ldv.table.displayNode',
    'ldv.ui.pagination',
    'ldv.filters',
    'ldv.table.taf',
    'ldv.services.entity',
    'ldv.templates.tripletable'
  ]);
valuesModule.directive('displayNodeValues', function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: false,
    scope: {
      about: '=',
      predicate: '=',
      values: '=',
      valfilter: '=',
      primarylang: '=',
      fallbacklang: '='
    },
    templateUrl: 'triple-table/displayValues/displayNodeValues.html',
    controller: 'DisplayNodeValuesCtrl'
  };
}).controller('DisplayNodeValuesCtrl', [
  '$scope',
  '$filter',
  function ($scope, $filter) {
    $scope.DisplayNodeValuesCtrl = true;
    var max = 10;
    var lim = 5;
    if ($scope.predicate.uri == 'http://www.georss.org/georss/point') {
      console.log('GEORSS found');
    }
    $scope.moreOrLess = function () {
      if ($scope.showMore) {
        $scope.showAll();
      } else {
        $scope.showLess();
      }
    };
    $scope.showLess = function () {
      if ($scope.vals.length > max) {
        for (var i = 0; i < $scope.vals.length; i++) {
          if (i < lim) {
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
    $scope.onShowAll = function () {
      $scope.showMore = true;
      $scope.moreOrLess();
    };
    $scope.showAll = function () {
      for (var i = 0; i < $scope.vals.length; i++) {
        $scope.vals[i].show = true;
      }
      $scope.showButton = false;
    };
    //*/
    $scope.$watch('valfilter+primarylang+fallbacklang', function (f) {
      $scope.applyFilters();
      $scope.moreOrLess();
    });
    $scope.applyFilters = function () {
      $scope.vals = $filter('valueFilter')($scope.values, $scope.valfilter);
      $scope.vals = $filter('languageFilter')($scope.vals, $scope.primarylang, $scope.fallbacklang);
    };
    $scope.showMore = false;
    $scope.showButton = false;
    $scope.applyFilters();
    $scope.moreOrLess();
    $scope.sortValues = function (item) {
      if (item.prefix !== undefined) {
        return item.prefix + item.short;
      } else {
        return item.label;
      }
    };
  }
]);
;
valuesModule.directive('displayReverseNodeValues', function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: false,
    scope: {
      about: '=',
      predicate: '=',
      values: '=',
      valfilter: '=',
      primarylang: '=',
      fallbacklang: '='
    },
    templateUrl: 'triple-table/displayValues/displayReverseNodeValues.html',
    controller: 'DisplayReverseNodeValuesCtrl'
  };
}).controller('DisplayReverseNodeValuesCtrl', [
  '$scope',
  '$filter',
  'Entity',
  'TafService',
  function ($scope, $filter, Entity, TafService) {
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
    $scope.onPageSelect = function (newpage) {
    };
    $scope.$watch('predicate.reverseloaded.page', function (page) {
      $scope.offset = page * $scope.limit;
      $scope.onLoad();
    });
    $scope.onLoadButton = function () {
      $scope.predicate.reverseloaded.loaded = true;
      $scope.onLoad();
    };
    $scope.loadCounts = function () {
      if ($scope.predicate.reverseloaded.loaded && $scope.predicate.reverseloaded.count < 1) {
        Entity.loadReverseValuesCount($scope.about, $scope.predicate).then(function (results) {
          $scope.predicate.reverseloaded.count = results[0].literalLabel.val;
        });
        ;
      }
    };
    $scope.getLoaded = function () {
      var loadedresults = [];
      var i = $scope.offset;
      while (i < $scope.offset + $scope.limit) {
        var loadedvalue = $scope.predicate.reverseloaded.table[i];
        if (loadedvalue) {
          loadedresults.push(loadedvalue);
        }
        i++;
      }
      return loadedresults;
    };
    $scope.onLoad = function () {
      if ($scope.predicate.reverseloaded.loaded) {
        $scope.loadCounts();
        if ($scope.getLoaded().length == 0) {
          var offset = $scope.offset;
          var limit = $scope.limit;
          Entity.loadReverseValues($scope.about, $scope.predicate, limit, offset).then(function (results) {
            $scope.showButtonLoad = false;
            for (var i = 0; i < results.length; i++) {
              if (!$scope.predicate.reverseloaded.table[i + offset]) {
                var resultentry = results[i];
                $scope.values.push(resultentry);
                resultentry.show = true;
                $scope.predicate.reverseloaded.table[i + offset] = resultentry;
              }
            }
            TafService.bindTafPredicate($scope.about, $scope.predicate);
            $scope.applyFilters();  /*$scope.vals = results;
								$scope.predicate.reverseloaded.vals = $scope.vals;
								for (var i = 0; i < Math.min($scope.limit, results.length); i++) {
									$scope.values.push(results[i]);
									results[i].show = true;
								}
								TafService.bindTafPredicate($scope.about, $scope.predicate);
								$scope.applyFilters();
								//*/
          }, function (error) {
          }, function (update) {
          });
          ;
        } else {
          $scope.applyFilters();
        }
      }
    };
    $scope.$watch('valfilter+primarylang+fallbacklang', function (f) {
      $scope.applyFilters();
    });
    $scope.applyFilters = function () {
      $scope.vals = $scope.getLoaded();
      $scope.vals = $filter('valueFilter')($scope.vals, $scope.valfilter);
      $scope.vals = $filter('languageFilter')($scope.vals, $scope.primarylang, $scope.fallbacklang);
    };
    $scope.applyFilters();
    $scope.sortValues = function (item) {
      if (item.prefix !== undefined) {
        return item.prefix + item.short;
      } else {
        return item.label;
      }
    };
  }
]);
;
var tableUI = angular.module('ldv.ui.filters', ['ldv.templates.tripletable']);
tableUI.directive('predicateFilter', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    templateUrl: 'triple-table/tableUI/predicateFilter.html',
    scope: { predfilter: '=' }
  };
});
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
tableUI.directive('valueFilter', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    templateUrl: 'triple-table/tableUI/valueFilter.html',
    scope: { valfilter: '=' }
  };
});
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
angular.module('ldv.table.taf', [
  'ldv.templates.tripletable',
  'ngSanitize'
]).directive('tripleActions', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    templateUrl: 'triple-table/taf/taf.html',
    scope: {
      taf: '=tripleActions',
      about: '=',
      predicate: '=',
      value: '='
    },
    controller: 'TripleActionsCtrl'
  };
}).controller('TripleActionsCtrl', [
  '$scope',
  function ($scope) {
    if ($scope.taf !== undefined) {
    }
  }
]).directive('tripleAction', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: {
      action: '=tripleAction',
      about: '=',
      predicate: '=',
      value: '='
    },
    templateUrl: 'triple-table/taf/tripleAction.html',
    controller: 'TripleActionCtrl'
  };
}).controller('TripleActionCtrl', [
  '$scope',
  function ($scope) {
    //console.log($scope.action);
    if ($scope.action.actions !== undefined && $scope.action.actions.length > 0) {
      $scope.group = true;  //alert("it's a group!");
    } else {
      $scope.group = false;  //alert("it's not a group"+$scope.action.group);
    }
  }
]).directive('tripleGroup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { action: '=' },
    template: '<div ng-show="doshow"></div>'
  };
});
;
angular.module('ldv.ui.classInstances', [
  'ldv.table.displayNode',
  'ldv.ui.pagination',
  'ui.jassa',
  'ldv.templates.ui'
]).directive('dbpvClassInstances', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      about: '=',
      primarylang: '=',
      fallbacklang: '='
    },
    templateUrl: 'ui/classInstances/classInstances.html',
    controller: 'DbpvClassInstancesCtrl'
  };
}).controller('DbpvClassInstancesCtrl', [
  '$scope',
  'Entity',
  'UrlService',
  function ($scope, Entity, UrlService) {
    // faceted browsing code //
    var service = Jassa.service;
    var facete = Jassa.facete;
    var sparqlServiceFactory = new service.SparqlServiceFactoryDefault();
    $scope.sparqlService = new service.SparqlServiceHttp(UrlService.endpoint(), UrlService.endpointgraph());
    $scope.sparqlService = new service.SparqlServiceCache($scope.sparqlService);
    // $scope.sparqlService = sparqlServiceFactory.createSparqlService(UrlService.endpoint, UrlService.endpointgraph);
    $scope.facetTreeConfig = new Jassa.facete.FacetTreeConfig();
    var baseVar = Jassa.rdf.NodeFactory.createVar('s');
    var classNode = Jassa.rdf.NodeFactory.createUri($scope.about.uri);
    var baseElement = new Jassa.sparql.ElementTriplesBlock([new Jassa.rdf.Triple(baseVar, Jassa.vocab.rdf.type, classNode)]);
    var baseConcept = new Jassa.facete.Concept(baseElement, baseVar);
    $scope.facetTreeConfig.getFacetConfig().setBaseConcept(baseConcept);
    var labelmap = Jassa.sponate.SponateUtils.createDefaultLabelMap([
        $scope.primarylang,
        $scope.fallbacklang
      ], LDViewer.getConfig('labelPrefs'));
    $scope.facetTreeConfig.labelMap = labelmap;
    $scope.path = null;
    $scope.selectFacet = function (path) {
      //alert('Selected Path: [' + path + ']');
      $scope.path = path;
    };
    $scope.$watch('primarylang', function (lang) {
      //alert("lang switch class instances");
      var labelmap = Jassa.sponate.SponateUtils.createDefaultLabelMap([
          lang,
          $scope.fallbacklang
        ], LDViewer.getConfig('labelPrefs'));
      $scope.facetTreeConfig.labelMap = labelmap;
    });
    $scope.processFacetedValues = function () {
      var fvs = new facete.FacetValueService($scope.sparqlService, $scope.facetTreeConfig);
      var fetcher = fvs.createFacetValueFetcher(new facete.Path(), '');
      var p1 = fetcher.fetchCount();
      var p2 = fetcher.fetchData($scope.offset, $scope.perpage);
      var result = jQuery.when.apply(null, [
          p2,
          p1
        ]).pipe(function (data, count) {
          $scope.instances = [];
          for (var i = 0; i < data.length; i++) {
            var result = data[i];
            if (result.node) {
              result.node.displayLabel = result.displayLabel;
              $scope.instances.push(result.node);
            }
          }
          $scope.total = count;
          $scope.$apply();
        });  //*/
    };
    //$scope.processFacetedValues();
    // end faceted browsing code //
    $scope.showPaginator = true;
    $scope.perpage = 15;
    $scope.page = 0;
    $scope.total = 0;
    $scope.criteria = '?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <' + $scope.about.uri + '>';
    $scope.getInstanceNumber = function () {
      if ($scope.showInstances) {
      }
    };
    LDViewer.showClassInstances = function () {
      $scope.showInstances = true;
      //$scope.getInstanceNumber();
      $scope.loadInstances();
    };
    $scope.loadInstances = function () {
      if ($scope.showInstances) {
        $scope.processFacetedValues();  /*Entity.loadReverseValues($scope.about, {"uri": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"}, $scope.perpage, $scope.offset)
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
    $scope.$watch('ObjectUtils.hashCode(facetTreeConfig)', function (cfg) {
      $scope.loadInstances();  //$scope.page = 0;
    }, true);
    $scope.$watch('page', function (page) {
      $scope.offset = $scope.page * $scope.perpage;
      $scope.loadInstances();
    });
    $scope.$watch('total', function (total) {
      $scope.loadInstances();
    });
  }
]);
;
angular.module('ldv.ui.custom', ['ldv.templates.ui']).directive('dbpvTop', [
  '$compile',
  function ($compile) {
    return {
      link: function (scope, element, attrs) {
        scope.goHome = function () {
          $('body,html').animate({ scrollTop: 0 }, 800);
          return false;
        };
        element.html('<a href=\'javascript:void(0);\' ng-click=\'goHome();\'><span class=\'glyphicon glyphicon-chevron-up\'></span></a>');
        $compile(element.contents())(scope);
        if ($(window).scrollTop() < 150) {
          element.css('visibility', 'hidden');
        }
        $(window).scroll(function () {
          if ($(window).scrollTop() > 150) {
            element.css('visibility', 'visible');
          } else {
            element.css('visibility', 'hidden');
          }
        });
      }
    };
  }
]).directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
}).directive('sameOffset', function () {
  return {
    link: function (scope, element, attrs) {
      var idToWatch = attrs.sameOffset;
      scope.$watch(function () {
        return angular.element(idToWatch).offset().top;
      }, function (top) {
        element.css('top', top);  //element.attr("smartscrollinit", top);
      });
    }
  };
}).directive('stupidScroll', [
  '$window',
  function ($window) {
    return {
      link: function (scope, element, attrs) {
      }
    };
  }
]).directive('smartScroll', [
  '$window',
  function ($window) {
    return {
      link: function (scope, element, attrs) {
        var prevset = 0;
        var inittop = 0;
        var scrolled = false;
        var inittop = attrs.smartScroll;
        if (inittop !== undefined)
          element.offset({
            'top': inittop,
            'left': element.offset().left
          });
        //alert(JSON.stringify(element.offset()));
        $(window).scroll(function () {
          if (inittop === undefined)
            inittop = attrs.smartScroll;
          if (inittop === undefined)
            inittop = element.attr('smartscrollinit');
          if (inittop === undefined)
            inittop = 0;
          var down = $(window).scrollTop() > prevset;
          prevset = $(window).scrollTop();
          var winh = $(window).height();
          var wins = $(window).scrollTop();
          var eleh = element.height();
          var eles = element.offset().top;
          var elel = element.offset().left;
          // distance top of element -> top of window
          var eletopmar = wins - eles;
          // distance bottom of window -> bottom element
          var elebotmar = eles + eleh - wins - winh;
          var cantop = wins;
          if (eleh > winh) {
            if (down) {
              if (eletopmar > 0) {
                var canelebotmar = elebotmar + eletopmar;
                if (elebotmar < 0) {
                  cantop = wins - canelebotmar;
                } else {
                  cantop = undefined;
                }
              }
            } else {
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
              element.offset({
                'top': cantop,
                'left': elel
              });
            } else {
              element.offset({
                'top': inittop,
                'left': elel
              });
            }
          }
        });
      }
    };
  }
]).directive('smartSlide', function () {
  return {
    link: function (scope, element, attrs) {
      var root = attrs.id;
      var original = $('#' + root + ' ' + attrs.smartSlideContent).css('right');
      $('#' + root + ' ' + attrs.smartSlideContent).hide();
      $('#' + root + ' ' + attrs.smartSlide).click(function () {
        var a = $('#' + root + ' ' + attrs.smartSlideContent).css('right');
        var a = a.substr(0, a.length - 2);
        if (a < 0) {
          $('#' + root + ' ' + attrs.smartSlideContent).show();
          $('#' + root + ' ' + attrs.smartSlideContent).animate({ right: '0px' }, 200);
        } else {
          $('#' + root + ' ' + attrs.smartSlideContent).animate({ right: original }, 200, function () {
            $('#' + root + ' ' + attrs.smartSlideContent).hide();
          });
        }
      });
    }
  };
}).directive('smartSlider', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: {
      content: '=',
      title: '=',
      state: '='
    },
    controller: 'SmartSliderCtrl',
    templateUrl: 'ui/custom/custom.html'
  };
}).controller('SmartSliderCtrl', [
  '$scope',
  function ($scope) {
    $scope.currentState = false;
    $scope.$watch('state', function (state) {
      if (state != $scope.currentState) {
        $scope.updateSlider();
      }
    });
    $scope.updateSlider = function () {
      if ($scope.state == true && $scope.currentState == false) {
        $scope.showSlider();
      } else if ($scope.state = false && $scope.currentState == true) {
        $scope.hideSlider();
      }
    };
    $scope.showSlider = function () {
    };
    $scope.hideSlider = function () {
    };
  }
]);
;
angular.module('ui-densor', []).directive('densor', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      data: '=',
      min: '=',
      max: '=',
      levels: '=',
      top: '=',
      bottom: '='
    },
    templateUrl: 'ui/densor/densor.html',
    controller: 'DensorCtrl'
  };
}).controller('DensorCtrl', [
  '$scope',
  function ($scope) {
    $scope.buckets = [
      1,
      2,
      3,
      4,
      3,
      4,
      2,
      2,
      5,
      2,
      1,
      5,
      5
    ];
  }
]);
;
angular.module('ldv.ui.disclaimer', ['ldv.templates.ui']).directive('dbpvDisclaimer', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      about: '=',
      localgraph: '='
    },
    controller: 'DbpvDisclaimerCtrl',
    templateUrl: 'ui/disclaimer/disclaimer.html'
  };
}).controller('DbpvDisclaimerCtrl', [
  '$scope',
  function ($scope) {
    console.log('disclaimer');
    $scope.suffix = '/resource/';
    $scope.disclaimed = false;
    LDViewer.setFooterWikipage = function (settings) {
      $scope.wikipage = settings;
    };
    if ($scope.about.uri.indexOf($scope.localgraph + $scope.suffix) != -1) {
      $scope.about.title = $scope.about.uri.slice(($scope.localgraph + $scope.suffix).length, $scope.about.uri.length);
      $scope.about.datalink = '/data/' + $scope.about.title;
      $scope.disclaimed = true;
    } else {
    }
  }
]);
;
angular.module('ldv.ui.disclaimer', ['ldv.templates.ui']).directive('dbpvDisclaimer', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      about: '=',
      localgraph: '='
    },
    controller: 'DbpvDisclaimerCtrl',
    templateUrl: 'ui/disclaimer/disclaimer.html'
  };
}).controller('DbpvDisclaimerCtrl', [
  '$scope',
  function ($scope) {
    console.log('disclaimer');
    $scope.suffix = '/resource/';
    $scope.disclaimed = false;
    LDViewer.setFooterWikipage = function (settings) {
      $scope.wikipage = settings;
    };
    if ($scope.about.uri.indexOf($scope.localgraph + $scope.suffix) != -1) {
      $scope.about.title = $scope.about.uri.slice(($scope.localgraph + $scope.suffix).length, $scope.about.uri.length);
      $scope.about.datalink = '/data/' + $scope.about.title;
      $scope.disclaimed = true;
    } else {
    }
  }
]);
;
var tableUI = angular.module('ldv.ui.filters', ['ldv.templates.ui']);
tableUI.directive('predicateFilter', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    templateUrl: 'ui/filters/predicateFilter.html',
    scope: { predfilter: '=' }
  };
});
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
tableUI.directive('valueFilter', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    templateUrl: 'ui/filters/valueFilter.html',
    scope: { valfilter: '=' }
  };
});
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
angular.module('ldv.ui.languageSwitch', [
  'ldv.services.languages',
  'ldv.templates.ui'
]).directive('dbpvLanguageSwitch', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: {
      primarylang: '=',
      languages: '='
    },
    controller: 'DbpvLanguageSwitchCtrl',
    templateUrl: 'ui/languageSwitch/languageSwitch.html'
  };
}).controller('DbpvLanguageSwitchCtrl', [
  '$scope',
  'LanguageService',
  function ($scope, LanguageService) {
    $scope.availableLanguages = {};
    $scope.newAvailableLanguage = function (args) {
      $scope.availableLanguages[args] = LanguageService.languages[args];
    };
    LDViewer.newAvailableLanguage = $scope.newAvailableLanguage;
    $scope.restLanguages = function () {
      var ret = {};
      for (var code in LanguageService.languages) {
        if (!(code in $scope.availableLanguages)) {
          ret[code] = LanguageService.languages[code];
        }
      }
      return ret;
    };
    //LDViewer.addNotification("noti test from lan switch", 500);
    /*if ($.cookie("dbpv_primary_lang") === undefined) {
			$.cookie("dbpv_primary_lang", $scope.primarylang, {expires:90, path: '/'});
		}//*/
    //$scope.primarylanguage = $.cookie("dbpv_primary_lang");//*/
    $scope.$watch('primarylang', function (lang) {
      if (lang != $scope.primarylanguage) {
        $scope.primarylanguage = lang;
      }
    });
    //*/
    $scope.$watch('primarylanguage', function (lang) {
      if (lang != $scope.primarylang) {
        $scope.primarylang = lang;
      }
      //$.cookie("dbpv_primary_lang", lang);
      Jassa.sponate.SponateUtils.defaultPrefLangs = [
        lang,
        $scope.fallbacklang
      ];
      if (!(lang in $scope.availableLanguages)) {
        var more = false;
        for (var k in $scope.availableLanguages) {
          more = true;
          break;
        }
        if (more)
          LDViewer.addNotification('There are no values in the chosen language for this entity', 5000);
      }  //$scope.$apply();
    });
    $scope.addNoti = function (text, timeout) {
      $scope.$broadcast('show notification', {
        'text': text,
        'timeout': timeout
      });
    };
    $scope.getNativeName = function (code) {
      return LanguageService.languages[code].nativeName;
    };
    $scope.selectLanguage = function (code) {
      $scope.primarylanguage = code;
    };
  }
]);
;
angular.module('ldv.ui.legend', [
  'ldv.templates.ui',
  'ngSanitize'
]).directive('dbpvLegend', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: {},
    templateUrl: 'ui/legend/legend.html',
    controller: 'DbpvLegendCtrl'
  };
}).controller('DbpvLegendCtrl', [
  '$scope',
  'TafService',
  function ($scope, TafService) {
    $scope.legends = [];
    $scope.addLegend = function (legend) {
      $scope.legends.push(legend);
    };
    $scope.actions = TafService.getActions();
    for (var i = 0; i < $scope.actions.length; i++) {
      var action = $scope.actions[i];
      if (typeof action.legend != 'undefined') {
        $scope.addLegend(action.legend);
      }
      if (action.group !== undefined && action.group.length > 0) {
        for (var j = 0; j < action.group.length; j++) {
          var act = action.group[j];
          if (typeof act.prototype.legend != 'undefined') {
            $scope.addLegend(act.prototype.legend);
          }
        }
      }
    }  //*/
  }
]);
;
//*/
angular.module('ldv.ui.lookup', [
  'ldv.services.search',
  'ui.bootstrap',
  'ldv.templates.ui'
]).directive('dbpvLookup', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    controller: 'DbpvLookupCtrl',
    scope: {
      localprefix: '=',
      lookupgraph: '=',
      lookupendpoint: '='
    },
    templateUrl: 'ui/lookup/lookup.html'
  };
}).controller('DbpvLookupCtrl', [
  '$scope',
  '$http',
  '$timeout',
  'Search',
  '$templateCache',
  '$q',
  function ($scope, $http, $timeout, Search, $templateCache, $q) {
    $templateCache.put('tpl/typeahead-custom.html', '<a><span ng-bind-html="match.label|typeaheadHighlight:query"></span><span class="typeahead-url" ng-if="match.model.url"> ({{match.model.url}})</span></a>');
    var timer = false;
    var delay = 500;
    $scope.results = [];
    $scope.$watch('querie', function (querie) {
      if (querie === undefined || querie == '') {
        $scope.results = [];
      } else {
        if (querie.url !== undefined) {
          if (querie.url.substr(0, $scope.lookupgraph.length) == $scope.lookupgraph) {
            querie.url = querie.url.substr($scope.lookupgraph.length);
            if ($scope.localprefix !== undefined && $scope.localprefix != '') {
              window.location = $scope.localprefix + querie.url;
            } else {
              window.location = querie.url;
            }
          }
        }
      }
    });
    $scope.lookup = function () {
      if ($scope.querie === undefined || $scope.querie == '') {
        $scope.results = [];
      } else {
        return Search.search($scope.querie, 10).then(function (results) {
          // Почему ты не работаешь?
          // Должно работать
          var res = [];
          for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var r = {
                'type': 'uri',
                'l_label': result['label'].literalLabel.lex,
                'url': result['uri'].uri
              };
            res.push(r);
          }
          console.log(res);
          return res;
        }, function (error) {
          var res = [];
          res.push({
            'type': 'uri',
            'l_label': 'NO RESULTS FOUND'
          });
          return res;
        });  //*/
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
  }
]);
;
angular.module('ldv.ui.notifications', ['ldv.templates.ui']).directive('dbpvNotifications', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: {},
    templateUrl: 'ui/notifications/notifications.html',
    controller: 'DbpvNotificationsCtrl'
  };
}).controller('DbpvNotificationsCtrl', [
  '$scope',
  '$timeout',
  function ($scope, $timeout) {
    LDViewer.addNotification = function (noti, time) {
      $scope.addNotification(noti, time);
    };
    $scope.notifications = [];
    $scope.$on('show notification', function (event, obj) {
      $scope.addNotification(obj.text, obj.timeout);
    });
    $scope.addNotification = function (text, timeout) {
      var noti = { 'text': text };
      if (timeout !== undefined) {
        noti.timeout = $timeout(function () {
          $scope.removeNotification(noti);
        }, timeout);
      }
      $scope.notifications.push(noti);
    };
    $scope.removeNotification = function (noti) {
      for (var i = 0; i < $scope.notifications.length; i++) {
        if (noti == $scope.notifications[i]) {
          $scope.notifications.splice(i, 1);
          if (noti.timeout !== undefined)
            $timeout.cancel(noti.timeout);
        }
      }
    };
  }
]);
;
var pagination = angular.module('ldv.ui.pagination', [
    'ldv.ui.custom',
    'ldv.templates.ui'
  ]);
pagination.directive('dbpvPagination', function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: false,
    scope: {
      page: '=',
      total: '=',
      perpage: '=',
      onSelect: '&'
    },
    templateUrl: 'ui/pagination/pagination.html',
    controller: 'DbpvPaginationCtrl'
  };
}).controller('DbpvPaginationCtrl', [
  '$scope',
  function ($scope) {
    $scope.init = function () {
      $scope.pages = Math.floor($scope.total / $scope.perpage);
    };
    $scope.$watch('page', function (page) {
      $scope.pagedis = $scope.page + 1;
    });
    /*$scope.$watch('pagedis', function(pagedis) {
			if (pagedis.length > 0)
			$scope.page = pagedis - 1;
		});
		//*/
    $scope.$watch('total', function (total) {
      $scope.init();
      $scope.checkVisibility();
    });
    $scope.onShowRight = function () {
      var newpage = $scope.page + 1;
      if (newpage <= $scope.pages) {
        $scope.page = newpage;
        $scope.onPageChange();
      }
    };
    $scope.onShowLeft = function () {
      var newpage = $scope.page - 1;
      if (newpage >= 0) {
        $scope.page = newpage;
        $scope.onPageChange();
      }
    };
    $scope.changePage = function () {
      $scope.page = $scope.pagedis - 1;
      if ($scope.page > $scope.pages) {
        $scope.page = $scope.pages;
      } else if ($scope.page < 0) {
        $scope.page = 0;
      }
      $scope.onPageChange();
    };
    $scope.onPageChange = function () {
      $scope.checkVisibility();
      $scope.onSelect($scope.page);
    };
    $scope.checkVisibility = function () {
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
  }
]);
;
angular.module('ldv.preview', [
  'ldv.filters',
  'ldv.templates.ui'
]).directive('dbpvPreview', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: false,
    controller: 'DbpvPreviewCtrl',
    link: function (scope, element, attrs) {
      var uri = undefined;
      if (attrs.dbpvPreview && attrs.dbpvPreview != '') {
        uri = attrs.dbpvPreview;
      } else {
        if (!scope.node || !scope.node.uri) {
          uri = attrs.href;
        } else {
          uri = scope.node.uri;
        }
      }
      scope.calll(uri, element);  //});
                                  //console.log("empty");
    }
  };
}).controller('DbpvPreviewCtrl', [
  '$scope',
  '$timeout',
  '$compile',
  'Preview',
  'UrlService',
  function ($scope, $timeout, $compile, Preview, UrlService) {
    $scope.calll = function (uri, element) {
      //alert($scope.url);
      element.bind('mouseenter', function () {
        $scope.onElementHover(uri, element);
      });
      element.bind('mouseleave', $scope.onElementUnhover);
    };
    $scope.populatePreview = function (node, dbpvp, scope) {
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
      }  //*/
    };
    $scope.onElementHover = function (uri, element) {
      if (!$scope.to) {
        $scope.to = $timeout(function () {
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
          element.after('<div id="dbpvpreview" style="position:absolute;top:{{dbpvp.position.top}}px;left:{{dbpvp.position.left}}px;" ><div id="dbpvpthumbnail">\t\t\t\t<img ng-src="{{dbpvp.thumbnail[0].uri}}"></img>\t\t\t</div><div id="dbpvptext">\t\t\t<div id="dbpvplabel">\t\t\t\t<span ng-repeat="value in dbpvp.label |languageFilter:primarylang:fallbacklang">\t\t\t\t\t{{value.literalLabel.lex}}\t\t\t\t</span>\t\t\t</div>\t\t\t<div id="dbpvpdescription">\t\t\t\t<span ng-repeat="value in dbpvp.description |languageFilter:primarylang:fallbacklang">\t\t\t\t\t{{value.literalLabel.lex}}\t\t\t\t</span>\t\t\t</div>\t\t\t</div><div ng-repeat="(key, val) in dbpvp.properties">\t\t\t\t<div id="dbpvpdescription">\t\t\t\t\t<span ng-show="val.length>0">\t\t\t\t\t\t{{key}}:\t\t\t\t\t\t<a href="{{val[0].uri}}">\t\t\t\t\t\t\t{{val[0].lex}}\t\t\t\t\t\t</a>\t\t\t\t\t</span>\t\t\t\t</div>\t\t\t</div><div id="loading" ng-show="previewSemaphore>0">\t\t\t<center><img style="margin-bottom:15px;" src="css/ajax-loader.gif"></img></center>\t\t</div></div>');
          $compile(element.next())($scope);  //$scope.bleh = "this is new bleh";
        }, 800);
      }
    };
    $scope.$watch('dbpvp.properties', function (props) {
      for (var key in props) {
        var vals = props[key];
        for (var i = 0; i < vals.length; i++) {
          var val = vals[i];
          var prefshor = UrlService.prefixify(val.uri);
          if (prefshor !== undefined && prefshor.length > 1) {
            val.lex = prefshor[0] + ':' + prefshor[1];
          } else {
            val.lex = val.uri;
          }
        }
      }
    }, true);
    $scope.onElementUnhover = function () {
      //alert("unhovered");
      $('#dbpvpreview').remove();
      if ($scope.to) {
        $timeout.cancel($scope.to);
        $scope.to = undefined;
      }  //*/
    };
  }
]).directive('dbpvPreviewBox', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    templateUrl: 'ui/preview/preview.html',
    scope: {
      dbpvp: '=',
      primarylang: '=',
      fallbacklang: '='
    }
  };
});
angular.module('ldv.ui.relationInstances', [
  'ldv.table.displayNode',
  'ldv.templates.ui'
]).directive('dbpvRelationInstances', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      about: '=',
      primarylang: '=',
      fallbacklang: '='
    },
    templateUrl: 'ui/relationInstances/relationInstances.html',
    controller: 'DbpvRelationInstancesCtrl'
  };
}).controller('DbpvRelationInstancesCtrl', [
  '$scope',
  'Entity',
  function ($scope, Entity) {
    LDViewer.showRelationInstances = function () {
      $scope.showInstances = true;
      console.log('getting instances');
      $scope.loadInstances(25);
    };
    $scope.loadInstances = function (number) {
      Entity.relationInstances($scope.about.uri, number).then(function (instances) {
        $scope.instances = instances;
      });
      ;
    };
  }
]);
;
angular.module('ldv.ui.settings', ['ldv.templates.ui']).directive('dbpvSettings', function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: false,
    scope: {},
    templateUrl: 'ui/settings/settings.html',
    controller: 'DbpvSettingsController'
  };
}).controller('DbpvSettingsController', [
  '$rootScope',
  '$scope',
  function ($rootScope, $scope) {
    $scope.settingsmap = [
      {
        'id': 'localprefix',
        'label': 'Local Prefix',
        'type': 'string',
        'prio': 0
      },
      {
        'id': 'localgraph',
        'label': 'Graph URI',
        'type': 'string',
        'prio': 1
      },
      {
        'id': 'endpoint',
        'label': 'Endpoint URI',
        'type': 'string',
        'prio': 2
      },
      {
        'id': 'fallbacklang',
        'label': 'Fallback Language',
        'type': 'lang',
        'prio': 0
      },
      {
        'id': 'encodegraph',
        'label': 'Encode Graph',
        'type': 'boolean',
        'prio': 5
      },
      {
        'id': 'godmode',
        'label': 'GraffHopper',
        'type': 'boolean',
        'prio': 6
      },
      {
        'id': 'showLabels',
        'label': 'Show Labels',
        'type': 'boolean',
        'prio': 4
      }
    ];
    $scope.settings = [];
    $scope.reset = function () {
      var cookies = $.cookie();
      for (var key in cookies) {
        var settingsprefix = 'dbpv_setting_';
        if (key.slice(0, settingsprefix.length) == settingsprefix) {
          $.removeCookie(key, { path: '/' });
        }
      }
      cookies = $.cookie();
      $scope.refresh();
    };
    $scope.refresh = function () {
      for (var i = 0; i < $scope.settings.length; i++) {
        if ($scope.saveInRoot($scope.settings[i]))
          $scope.saveAsCookie($scope.settings[i]);
      }
      window.location.reload(false);
    };
    $scope.makeSettings = function () {
      for (var i = 0; i < $scope.settingsmap.length; i++) {
        var setting = $scope.settingsmap[i];
        if (setting.prio > 0) {
          var cookied = $scope.loadFromCookies(setting.id);
          if (cookied) {
            setting.value = cookied;
            if (setting.type == 'boolean') {
              setting.value = setting.value == 'true' ? true : false;
            }
            $scope.saveInRoot(setting);
          } else {
            setting.value = $rootScope[setting.id];
          }
          if (setting.value !== undefined) {
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
      }
      console.log(JSON.stringify($scope.settings));
    };
    $scope.saveInRoot = function (setting) {
      if ($rootScope[setting.id] !== undefined && setting.value != $rootScope[setting.id]) {
        $rootScope[setting.id] = setting.value;
        return true;
      }
      return false;
    };
    $scope.watchSettings = function () {
      $scope.$watch('settings', function (settings) {
        for (var i = 0; i < settings.length; i++) {
          if ($scope.saveInRoot(settings[i]))
            $scope.saveAsCookie(settings[i]);
        }
      }, true);
    };
    //*/
    $scope.saveAsCookie = function (setting) {
      if (setting.id && setting.value !== undefined) {
        $.cookie('dbpv_setting_' + setting.id, setting.value, {
          expires: 90,
          path: '/'
        });
      }
    };
    $scope.loadFromCookies = function (settingid) {
      if ($.cookie('dbpv_setting_' + settingid) !== undefined) {
        return $.cookie('dbpv_setting_' + settingid);
      }
    };
    $scope.makeSettings();  //$scope.watchSettings();
  }
]);
;
angular.module('ldv.ui.shortcuts', [
  'ldv.ui.custom',
  'ldv.services.UrlService',
  'ldv.ui.custom',
  'ldv.templates.ui'
]).directive('shortcutBox', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: {},
    templateUrl: 'ui/shortcuts/shortcuts.html',
    controller: 'ShortcutBoxCtrl'
  };
}).controller('ShortcutBoxCtrl', [
  '$scope',
  function ($scope) {
    $scope.shortcuts = [];
    LDViewer.addShortcut = function (url, label, prio) {
      //$scope.$apply(function() {
      var neue = {
          'url': url,
          'label': label,
          'prio': prio
        };
      var prevbigger = false;
      var added = false;
      var duplicate = false;
      for (var i = 0; i < $scope.shortcuts.length; i++) {
        if (url == $scope.shortcuts[i].url) {
          duplicate = true;
          break;
        }
      }
      if (!duplicate) {
        for (var i = 0; i < $scope.shortcuts.length; i++) {
          if ($scope.shortcuts[i].prio < neue.prio) {
            $scope.shortcuts.splice(i, 0, neue);
            added = true;
            break;
          }
        }
        if ($scope.shortcuts.length == 0 || !added) {
          $scope.shortcuts.push(neue);
        }
      }  //});
    };
  }
]).directive('shortcut', [
  '$compile',
  'UrlService',
  function ($compile, UrlService) {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        var pred = scope.$eval(attrs.shortcut);
        var label = scope.$eval(attrs.shortcutLabel);
        scope.useShortcut = function () {
          pred = UrlService.makeUrl(pred).uri;
          var amt = $('a[href=\'' + pred + '\']');
          if (amt !== undefined) {
            amt = parseInt(amt.offset().top) - 10;
            $('body,html').animate({ scrollTop: amt }, 100);
            return false;
          }
        };
        element.html('<a href=\'javascript:void(0);\' ng-click=\'useShortcut();\'>' + label + '</a>');
        $compile(element.contents())(scope);
      }
    };
  }
]);
;
angular.module('ldv.ui.splash', []).directive('ldvSplash', function () {
  return {
    restrict: 'EA',
    replace: true,
    template: '<div ng-show="show" id="ldv-splash" style="position:absolute; top:0; left:0; background-color: #57f; z-index:2000; width: 100%; height:100%;font-size: 3em; color:white;text-align:center; padding-top:100px;">LOADING...</div>',
    controller: 'LdvSplashCtrl'
  };
}).controller('LdvSplashCtrl', [
  '$rootScope',
  function ($rootScope) {
    $scope.show = false;
    $rootScope.$watch('showSplash', function (showSplash) {
      $scope.show = showSplash;
      $('#ldv-splash').remove();
    });
  }
]);
;
angular.module('ldv.ui.status', [
  'ldv.templates.ui',
  'ngSanitize'
]).directive('dbpvStatus', function () {
  return {
    restrict: 'EA',
    transclude: false,
    replace: true,
    scope: {},
    controller: 'DbpvStatusCtrl',
    templateUrl: 'ui/status/status.html'
  };
}).controller('DbpvStatusCtrl', [
  '$scope',
  '$rootScope',
  function ($scope, $rootScope) {
    $scope.stasi = [];
    $scope.kgb = 0;
    $scope.stasiSemaphore = 0;
    $scope.stasiChange = 0;
    $scope.addStatus = function (text, icon) {
      if (text) {
        var status = {
            'text': text,
            'icon': icon
          };
        return $scope.getStatusHandler(status);
      }
    };
    $scope.getStatusHandler = function (status) {
      $scope.stasi.push(status);
      $scope.kgb++;
      $scope.stasiChange++;
      status.id = $scope.kgb;
      console.log('New status id :' + status.id);
      return {
        'delete': function () {
          $scope.removeStatus(status);
        }
      };
    };
    LDViewer.addStatus = function (status, icon) {
      return $scope.addStatus(status, icon);
    };
    $scope.removeStatus = function (status) {
      if (status && status.text && status.id) {
        console.log('Removing status with id :' + status.id);
        $scope.stasiChange++;
        $scope.stasiSemaphore++;
        var i = 0;
        while (i < $scope.stasi.length) {
          if ($scope.stasi[i].id == status.id) {
            $scope.stasi[i].delete = true;
            break;
          }
          i++;
        }
        $scope.stasiSemaphore--;
      }
    };
    $scope.$watch('stasiChange', function (s) {
      var sem = $scope.stasiSemaphore;
      console.log('Stasi semaphore :' + sem);
      if (sem == 0) {
        var i = 0;
        while (i < $scope.stasi.length) {
          if ($scope.stasi[i].delete) {
            $scope.stasi.splice(i, 1);
            i--;
          }
          i++;
        }
      }
    });  //var sh = $scope.addStatus({"icon": '<span class="glyphicon glyphicon-book"></span>', "text": "This is a test status"});
  }
]);
;
angular.module('ldv.ui.survey', ['ldv.templates.ui']).directive('dbpvSurvey', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {},
    templateUrl: 'ui/survey/survey.html',
    controller: 'DbpvSurveyCtrl'
  };
}).controller('DbpvSurveyCtrl', [
  '$scope',
  function ($scope) {
    if ($.cookie('dbpv_survey') == 'true') {
      $scope.showSurvey = false;
    } else {
      $scope.showSurvey = true;
    }
    $scope.surveyClicked = function () {
      window.open('https://www.surveymonkey.com/s/N72M2JP');
      $scope.showSurvey = false;
      $.cookie('dbpv_survey', 'true', {
        expires: 90,
        path: '/'
      });
    };
  }
]);
;
angular.module('ldv.ui.topbar', [
  'ldv.ui.languageSwitch',
  'ldv.compile',
  'ldv.ui.lookup',
  'ldv.ui.settings',
  'ldv.ui.legend',
  'ldv.templates.ui'
]).directive('dbpvTopbar', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      logo: '=',
      primarylang: '=',
      languages: '=',
      lookupendpoint: '=',
      lookupgraph: '=',
      localgraph: '=',
      localprefix: '='
    },
    templateUrl: 'ui/topbar/topbar.html'
  };
}).directive('dbpvTopbuttons', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {},
    templateUrl: 'ui/topbar/topbarbutton.html',
    controller: 'DbpvTopbuttonsCtrl'
  };
}).controller('DbpvTopbuttonsCtrl', [
  '$scope',
  function ($scope) {
    $scope.buttons = [];
    $scope.content = '';
    $scope.showContent = false;
    $scope.activeButton = null;
    $scope.buttons = [
      {
        'id': 'settings',
        'description': 'Change Settings',
        'css-id': 'dbpv-settingsbutton',
        'display': '<span class="glyphicon glyphicon-cog"></span>',
        'execute': function () {
          $scope.content = '<div dbpv-settings></div>';
          $scope.showContent = true;
        },
        'nexecute': function () {
          $scope.content = '';
          $scope.showContent = false;
        }
      },
      {
        'id': 'tour',
        'description': 'Take a tour',
        'css-id': 'dbpv-tourbutton',
        'display': '<span class="glyphicon glyphicon-bookmark"></span>',
        'execute': function () {
          var custom = introJs().setOptions({
              'skipLabel': '',
              'nextLabel': '<span class=\'glyphicon glyphicon-arrow-right\'></span>',
              'prevLabel': '<span class=\'glyphicon glyphicon-arrow-left\'></span>'
            });
          $scope.inactivateActiveButton();
          custom.start();
        }
      },
      {
        'id': 'legend',
        'description': 'View Legend',
        'css-id': 'dbpv-legendbutton',
        'display': '<span class="glyphicon glyphicon-book"></span>',
        'execute': function () {
          $scope.content = '<div dbpv-legend></div>';
          $scope.showContent = true;
        },
        'nexecute': function () {
          $scope.content = '';
          $scope.showContent = false;
        }
      }
    ];
    $scope.buttonClicked = function (button) {
      /*for (var i = 0; i < $scope.buttons.length; i++) {
				$scope.buttons[i].active = false;
			}
			button.active = true;//*/
      if ($scope.activeButton == button) {
        $scope.inactivateActiveButton();
      } else {
        if ($scope.activeButton && $scope.activeButton.nexecute)
          $scope.activeButton.nexecute();
        $scope.activeButton = button;
        if (button.execute)
          button.execute();
      }
    };
    $scope.inactivateActiveButton = function () {
      if ($scope.activeButton) {
        if ($scope.activeButton.nexecute)
          $scope.activeButton.nexecute();
        $scope.activeButton = null;
      }
    };
    $scope.buttonActive = function (button) {
      return $scope.activeButton == button ? 'active' : 'inactive';
    };
  }
]);
;
angular.module('ldv.ui', [
  'ldv.ui.classInstances',
  'ldv.ui.disclaimer',
  'ldv.ui.topbar',
  'ldv.ui.relationInstances',
  'ldv.ui.status',
  'ldv.ui.shortcuts',
  'ldv.ui.notifications'
]);
angular.module('ldv.templates.main', [
  'tpl/entity.html',
  'tpl/search.html',
  'tpl/test.html'
]);
angular.module('tpl/entity.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('tpl/entity.html', '<div id="triples">\n' + '<div shortcut-box shortcuts="shortcuts"></div>\n' + '\n' + '<!--div dbpv-legend actions="actions"></div-->\n' + '\n' + '<div id="pretty-box" class="top-block" data-intro="This is the pretty box. It displays a small selection of entity properties in a pretty way." data-step="3">\n' + '\n' + '\t<!--div id="entityOptions">\n' + '\t\t<span>\n' + '\t\t  <a href="javascript:void(0);" class="dropdown-toggle glyphicon glyphicon-th-large" style="font-size:20px" data-toggle="dropdown"></a>\n' + '\t\t  <ul class="dropdown-menu" role="menu">\n' + '\t\t\t<li><a href="/describe/?uri={{about.uri}}" target="_self">OpenLink Faceted Browser</a></li>\n' + '\t\t\t<li><a href="http://linkeddata.uriburner.com/ode/?uri={{about.uri}}">OpenLink Data Explorer</a></li>\n' + '\t\t  </ul>\n' + '\t\t</span>\n' + '\t\t\n' + '\t\t<span>\n' + '\t\t  <a href="javascript:void(0);" class="dropdown-toggle dbpvicon dbpvicon-rdf" data-toggle="dropdown"></a>\n' + '\t\t  <ul class="dropdown-menu" role="menu">\n' + '\t\t\t<li><a href="{{about.datalink}}.rdf" target="_self">RDF/XML</a></li>\n' + '\t\t\t<li><a href="{{about.datalink}}.ntriples" target="_self">RDF/N-triples</a></li>\n' + '\t\t\t<li><a href="{{about.datalink}}.json" target="_self">RDF/JSON</a></li>\n' + '\t\t\t<li><a href="{{about.datalink}}.n3" target="_self">RDF/N3-Turtle</a></li>\n' + '\t\t  </ul>\n' + '\t\t</span>\n' + '\t\t\n' + '\t\t<span>\n' + '\t\t  <a href="javascript:void(0);" class="dropdown-toggle dbpvicon dbpvicon-json" data-toggle="dropdown"></a>\n' + '\t\t  <ul class="dropdown-menu" role="menu">\n' + '\t\t\t<li><a href="/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+<{{about.uri}}>&amp;output=application%2Fmicrodata%2Bjson" target="_self">Microdata/JSON</a></li>\n' + '\t\t\t<li><a href="/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+<{{about.uri}}>&amp;output=application%2Fld%2Bjson" target="_self">JSON-LD</a></li>\n' + '\t\t\t<li><a href="{{about.datalink}}.json"  target="_self">RDF/JSON</a></li>\n' + '\t\t  </ul>\n' + '\t\t</span>\n' + '\t</div-->\n' + '\t\n' + '\t<div pretty-box about="about" dbpvp="dbpvp" primarylang="primarylang" fallbacklang="fallbacklang" owlgraph=\'owlgraph\' owlendpoint="owlendpoint" entity-semaphore="entitySemaphore"></div>\n' + '\n' + '</div>\n' + '<div dbpv-preview-box dbpvp="preview" primarylang="primarylang" fallbacklang="fallbacklang"></div>\n' + '\n' + '\n' + '<div dbpvp-map></div>\n' + '\n' + '<div id="triple-list">\n' + '\n' + '<div id="triples">\n' + '\n' + '\t<div display-predicates primarylang="primarylang" fallbacklang="fallbacklang" about="about">\n' + '\n' + '\t</div>\n' + '\t\n' + '\t<div dbpv-relation-instances about="about" primarylang="primarylang" fallbacklang="fallbacklang">\n' + '\t</div>\n' + '\t\n' + '\t<div dbpv-class-instances about="about" primarylang="primarylang" fallbacklang="fallbacklang"></div>\n' + '\n' + '</div>\n' + '\n' + '\n' + '\n' + '\n' + '<div class="footer">\n' + '    <div id="ft_t">\n' + '        Browse using:\n' + '\t<a href="http://linkeddata.uriburner.com/ode/?uri={{about.uri}}">OpenLink Data Explorer</a> |\n' + '\t<a href="/describe/?uri={{about.uri}}">OpenLink Faceted Browser</a>\n' + '        <!--a href="http://dataviewer.zitgist.com/?uri=http%3A%2F%2Fdbpedia.org%2Fresource%2FBoris_Johnson">Zitgist Data Viewer</a> |\n' + '        <a href="http://beckr.org/marbles?uri=http%3A%2F%2Fdbpedia.org%2Fresource%2FBoris_Johnson">Marbles</a> |\n' + '        <a href="http://www4.wiwiss.fu-berlin.de/rdf_browser/?browse_uri=http%3A%2F%2Fdbpedia.org%2Fresource%2FBoris_Johnson">DISCO</a> |\n' + '        <a href="http://dig.csail.mit.edu/2005/ajar/release/tabulator/0.8/tab.html?uri=http%3A%2F%2Fdbpedia.org%2Fresource%2FBoris_Johnson" >Tabulator</a-->\n' + '        &nbsp; &nbsp; Raw Data in:\n' + '\t\n' + '        <a href="/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+&lt;{{about.uri}}&gt;&amp;format=text/csv" target="_self" >CSV</a> | RDF (\n' + '        <a href="{{about.datalink}}.ntriples" target="_self" >N-Triples</a> \n' + '        <a href="{{about.datalink}}.n3" target="_self" >N3/Turtle</a> \n' + '\t<a href="{{about.datalink}}.json" target="_self" >JSON</a> \n' + '        <a href="{{about.datalink}}.rdf" target="_self" >XML</a> ) | OData (\n' + '\t<a href="{{about.datalink}}.atom" target="_self" >Atom</a> \n' + '\t<a href="{{about.datalink}}.json" target="_self" >JSON</a> )| Microdata (\n' + '\t<a href="/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+&lt;{{about.uri}}&gt;&amp;output=application/microdata-json" target="_self" > JSON</a>\n' + '        <a href="/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+&lt;{{about.uri}}&gt;&amp;output=text/html" target="_self" >HTML</a>) |  \n' + '        <a href="/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+&lt;{{about.uri}}&gt;&amp;output=application/ld-json" target="_self" >JSON-LD</a> \n' + '\n' + '        &nbsp; &nbsp;<a href="http://wiki.dbpedia.org/Imprint">About</a>&nbsp; &nbsp;\n' + '      </div> <!-- #ft_t -->\n' + '      <div id="ft_b">\n' + '        <a href="http://virtuoso.openlinksw.com" title="OpenLink Virtuoso"><img class="powered_by" src="css/virt_power_no_border.png" alt="Powered by OpenLink Virtuoso"></a>\n' + '        <a href="http://linkeddata.org/"><img alt="This material is Open Knowledge" src="css/LoDLogo.gif"></a> &nbsp;\n' + '        <a href="http://dbpedia.org/sparql"><img alt="W3C Semantic Web Technology" src="css/sw-sparql-blue.png"></a> &nbsp;  &nbsp;\n' + '        <a href="http://www.opendefinition.org/"><img alt="This material is Open Knowledge" src="css/od_80x15_red_green.png"></a>\n' + '\t<span about="" resource="http://www.w3.org/TR/rdfa-syntax" rel="dc:conformsTo" xmlns:dc="http://purl.org/dc/terms/">\n' + '\t<a href="http://validator.w3.org/check?uri=referer"><img src="http://www.w3.org/Icons/valid-xhtml-rdfa" alt="Valid XHTML + RDFa" height="27"></a>\n' + '\t</span>\n' + '      </div> <!-- #ft_b -->\n' + '\t  <div dbpv-disclaimer about="about" localgraph="localgraph"></div>\n' + '</div>\n' + '\n' + '</div>\n' + '</div>\n' + '');
  }
]);
angular.module('tpl/search.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('tpl/search.html', '<div class="search-results">\n' + '\n' + '</div>');
  }
]);
angular.module('tpl/test.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('tpl/test.html', '\n' + '\t<span class="dropdown">\n' + '\t\t<a role="button" href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">\n' + '\t\t\tdrop the\n' + '\t\t</a>\n' + '\t\t<ul class="dropdown-menu" role="menu">\n' + '\t\t\t<li><a>beat</a></li>\n' + '\t\t\t<li><a>eggs</a></li>\n' + '\t\t</ul>\n' + '\t</span>\n' + '\t<span class="dropdown btn-group">\n' + '\t\t<a role="button" href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">\n' + '\t\t\tdrop the\n' + '\t\t</a>\n' + '\t\t<ul class="dropdown-menu" role="menu">\n' + '\t\t\t<li>beat</li>\n' + '\t\t\t<li>eggs</li>\n' + '\t\t</ul>\n' + '\t</span>');
  }
]);
angular.module('ldv.templates.pretty', [
  'pretty/prettyLinks/prettyLinks.html',
  'pretty/prettyList/prettyList.html',
  'pretty/prettyMap/prettyMap.html',
  'pretty/prettyTypes/prettyTypes.html',
  'pretty/prettybox/prettybox.html'
]);
angular.module('pretty/prettyLinks/prettyLinks.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('pretty/prettyLinks/prettyLinks.html', '<div id="dbpvplinks">\t\t\t\n' + '<div ng-repeat="(label, list) in links" style="float:left;margin-right: 15px;">\t\t\t\t<div ng-if="list.length>1" class="dropdown">\t\t\t\t\t\n' + '\n' + '<a role="button" href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">{{label}} \n' + '\t<span class="glyphicon glyphicon-chevron-down" style="font-size:0.6em;"></span>\n' + '</a>\t\t\t\t\t\n' + '<ul class="dropdown-menu">\t\t\t\t\t\t\n' + '\t<li ng-repeat="link in list"><a target="_blank" href="{{link.uri}}">{{link.plex}}</a></li>\t\t\t\t\t\t\t\t\t\n' + '</ul>\t\t\t\n' + '\n' + '</div>\t\t\t\t<div ng-if="list.length==1">\t\t\t\t\t<a target="_blank" href="{{list[0].uri}}">{{list[0].plex}}</a>\t\t\t\t</div>\t\t\t</div>\t\t</div>');
  }
]);
angular.module('pretty/prettyList/prettyList.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('pretty/prettyList/prettyList.html', '<div id="dbpvpproperties" ng-show="showProperties()"><table id="dbpvplist"><tr ng-repeat="property in properties | orderBy:prioSort" class="propertyentry"><td class="propertykey"><div display-node settings="" showlanguage="false" node="property.key" primarylang="primarylang" fallbacklang="fallbacklang"></div>:</td><td  class="propertyvalues"><div ng-repeat="value in property.values"><div display-node node="value" settings="displayset" class="propertyvalue" primarylang="primarylang" fallbacklang="fallbacklang" showlanguage="false" dbpv-preview></div></div></div></td></tr></table></div>');
  }
]);
angular.module('pretty/prettyMap/prettyMap.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('pretty/prettyMap/prettyMap.html', '<div id="dbpvpmapcontainer" class="top-block"><div id="dbpvpmap"></div></div>');
  }
]);
angular.module('pretty/prettyTypes/prettyTypes.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('pretty/prettyTypes/prettyTypes.html', '<div id="dbpvptypes" ng-show="types.length>0"><span class="dbpvptype" ng-repeat="type in types"><span pretty-type node="type" primarylang="primarylang" fallbacklang="fallbacklang" owlgraph="owlgraph" owlendpoint="owlendpoint"></span><span class="comma">, </span></span></div>');
  }
]);
angular.module('pretty/prettybox/prettybox.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('pretty/prettybox/prettybox.html', '<div>\n' + '\t<div id="dbpvpthumbnail"><img ng-src="{{dbpvp.thumbnail[0].uri}}"></img>\t</div>\t<div id="dbpvptext">\t\t\n' + '\t\t<div id="dbpvplabel">\t\t\t\n' + '\t\t\t<span ng-repeat="value in dbpvp.label |languageFilter:primarylang:fallbacklang">\t\t\t\t\n' + '\t\t\t\t<a href="{{about.uri}}">{{value.literalLabel.lex}}</a>\t\t\t\n' + '\t\t\t</span>\t\t\n' + '\t\t</div>\t\t\n' + '\t\t<div pretty-types types="dbpvp.types" primarylang="primarylang" fallbacklang="fallbacklang" owlgraph="owlgraph" owlendpoint="owlendpoint"></div>\t\t\n' + '\t\t<div id="dbpvpdescription">\t\t\t\n' + '\t\t\t<span ng-repeat="value in dbpvp.description |languageFilter:primarylang:fallbacklang">\t\t\t\t\n' + '\t\t\t\t{{value.literalLabel.lex}}\t\t\t\n' + '\t\t\t</span>\t\t\n' + '\t\t</div>\t\t\n' + '\t\t<div pretty-links links="dbpvp.links"></div> \n' + '\t\t<div dbpvp-list properties="dbpvp.properties" primarylang="primarylang" fallbacklang="fallbacklang">\n' + '\t\t</div>\n' + '\t\t<div id="loading" ng-if="semaphore>0">\t\t\t\n' + '\t\t\t<center><img style="margin-bottom:15px;" src="css/ajax-loader.gif"></img></center>\t\t\n' + '\t\t</div>\n' + '\t\t<div id="loadMsg" ng-if="showMsg">{{loadmsg}}</div>\n' + '\t</div>\n' + '</div>');
  }
]);
angular.module('ldv.templates.tripletable', [
  'triple-table/displayPredicates/displayPredicate.html',
  'triple-table/displayPredicates/displayPredicates.html',
  'triple-table/displayPredicates/displayReversePredicate.html',
  'triple-table/displayValues/displayNodeValues.html',
  'triple-table/displayValues/displayReverseNodeValues.html',
  'triple-table/tableUI/predicateFilter.html',
  'triple-table/tableUI/valueFilter.html',
  'triple-table/taf/taf.html',
  'triple-table/taf/tripleAction.html'
]);
angular.module('triple-table/displayPredicates/displayPredicate.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('triple-table/displayPredicates/displayPredicate.html', '<div>\n' + '\t<div class="pred-name">\n' + '\t<span display-node settings="" showlanguage="true" node="predicate" primarylang="primarylang" fallbacklang="fallbacklang"></span></div><div display-node-values about="about" predicate="predicate" values="predicate.values" valfilter="valfilter" primarylang="primarylang" fallbacklang="fallbacklang"></div>\n' + '\t\t<div style="clear:both"></div>\n' + '</div>');
  }
]);
angular.module('triple-table/displayPredicates/displayPredicates.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('triple-table/displayPredicates/displayPredicates.html', '<div class="top-block"> \n' + '\t\t\t\t\t\t<div id="triples-top" ng-show="showFilters">\n' + '\t\t\t\t\t\t<div class="predicate">\n' + '\t\t\t\t\t\t\t\t<div class="pred-name form-inline">\n' + '\t\t\t\t\t\t\t\t\t<label class="dbpv-tabletop"> Property:\n' + '\t\t\t\t\t\t\t\t\t</label> \n' + '\t\t\t\t\t\t\t\t\t<span predicate-filter predfilter="predfilter">\n' + '\t\t\t\t\t\t\t\t\t</span>\n' + '\t\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t\t\t<div class="pred-values">\t\t\n' + '\t\t\t\t\t\t\t\t\t<div class="pred-value form-inline"> \n' + '\t\t\t\t\t\t\t\t\t\t<label class="dbpv-tabletop"> Value: \n' + '\t\t\t\t\t\t\t\t\t\t</label> \n' + '\t\t\t\t\t\t\t\t\t\t<span value-filter valfilter="valfilter">\n' + '\t\t\t\t\t\t\t\t\t\t</span>\n' + '\t\t\t\t\t\t\t\t\t</div>\t\n' + '\t\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t\t\t<div style="clear:both"></div>\n' + '\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t<div class="predicate" ng-repeat="(id, predicate) in predicates | predicateFilter:predfilter | predicateValueFilter:valfilter | orderBy:sortPredicates">\n' + '\t\t\t\t\t\t\t<div ng-switch on="predicate.forward">\n' + '\t\t\t\t\t\t\t\t<div ng-switch-when="true">\n' + '\t\t\t\t\t\t\t\t\t<div display-predicate about="about" predicate="predicate" valfilter="valfilter" primarylang="primarylang" fallbacklang="fallbacklang">\n' + '\t\t\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t\t\t<div ng-switch-default>\n' + '\t\t\t\t\t\t\t\t<div display-reverse-predicate about="about" predicate="predicate" \n' + '\t\t\t\t\t\t\tvalfilter="valfilter"\n' + '\t\t\t\t\t\t\t\t\tprimarylang="primarylang" fallbacklang="fallbacklang">\n' + '\t\t\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t</div>');
  }
]);
angular.module('triple-table/displayPredicates/displayReversePredicate.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('triple-table/displayPredicates/displayReversePredicate.html', '<div>\n' + '\t<div class="pred-name">\n' + '\t\t<span display-node settings="" showlanguage="true" node="predicate" primarylang="primarylang" fallbacklang="fallbacklang"></span>\n' + '\t</div>\n' + '\t<div display-reverse-node-values about="about" predicate="predicate" values="predicate.values" valfilter="valfilter" primarylang="primarylang" fallbacklang="fallbacklang"></div>\n' + '\t<div style="clear:both"></div>\n' + '</div>');
  }
]);
angular.module('triple-table/displayValues/displayNodeValues.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('triple-table/displayValues/displayNodeValues.html', '<div class="pred-values"><div class="pred-value" ng-repeat="val in vals | orderBy:sortValues" ng-show="val.show"><span triple-actions="val.taf" about="about" predicate="predicate" value="val"></span> <span display-node node="val" primarylang="primarylang" fallbacklang="fallbacklang" settings="" showlanguage="true"></span></div><div ng-show="showButton"><button class="btn btn-block btn-primary btn-small btn-show-more dbpv-btn" ng-click="onShowAll()">Show All</button></div></div>');
  }
]);
angular.module('triple-table/displayValues/displayReverseNodeValues.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('triple-table/displayValues/displayReverseNodeValues.html', '<div class="pred-values"><div class="pred-value" ng-repeat="val in vals | orderBy:sortValues" ng-show="val.show"><span triple-actions="val.taf" about="about" predicate="predicate" value="val"></span> <span display-node node="val" primarylang="primarylang" fallbacklang="fallbacklang" settings="" showlanguage="true"></span></div>\n' + '\t\t<div ng-show="!predicate.reverseloaded.loaded"><button class="btn btn-block btn-primary btn-small btn-show-more dbpv-btn" ng-click="onLoadButton()">LOAD</button></div><div dbpv-pagination page="predicate.reverseloaded.page" total="predicate.reverseloaded.count" perpage="limit" on-select="onPageSelect(newpage)"></div></div>');
  }
]);
angular.module('triple-table/tableUI/predicateFilter.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('triple-table/tableUI/predicateFilter.html', '<input class="form-control dbpv-input dbpv-filter dbpv-filter-pred" ng-model="predfilter" data-intro="Filter predicates using a string." data-step="4"/>');
  }
]);
angular.module('triple-table/tableUI/valueFilter.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('triple-table/tableUI/valueFilter.html', '<input class="form-control dbpv-input dbpv-filter dbpv-filter-val" ng-model="valfilter" data-intro="Filter values using a string." data-step="5"/>');
  }
]);
angular.module('triple-table/taf/taf.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('triple-table/taf/taf.html', '<span class="dbpv-taf"><span ng-repeat="action in taf"><span triple-action="action" value="value" predicate="predicate" about="about"></span></span>');
  }
]);
angular.module('triple-table/taf/tripleAction.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('triple-table/taf/tripleAction.html', '<span><span ng-hide="group">\n' + '\t<a href="javascript:void(0);" title="{{action.description}}" ng-click="action.execute(about, predicate, value);"> \n' + '\t\t<span ng-bind-html="action.display();"></span> \n' + '\t</a>\n' + '</span>\n' + '<span class="dropdown" ng-show="group">\n' + '\t<a role="button" class="dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);" title="{{action.description}}"> \n' + '\t\t<span ng-bind-html="action.display();"></span> \n' + '\t</a>\n' + '\t<ul class="dropdown-menu action-group" role="menu">\n' + '\t\t<li ng-repeat="act in action.actions">\n' + '\t\t\t<a href="javascript:void(0);" title="{{act.description}}" ng-click="act.execute(about, predicate, value);"> \n' + '\t\t\t\t<span ng-bind-html="act.display();"></span> \n' + '\t\t\t</a>\n' + '\t\t</li>\n' + '\t</ul>\n' + '</span></span>');
  }
]);
angular.module('ldv.templates.ui', [
  'ui/classInstances/classInstances.html',
  'ui/custom/custom.html',
  'ui/densor/densor.html',
  'ui/disclaimer/disclaimer.html',
  'ui/filters/predicateFilter.html',
  'ui/filters/valueFilter.html',
  'ui/languageSwitch/languageSwitch.html',
  'ui/legend/legend.html',
  'ui/lookup/lookup.html',
  'ui/notifications/notifications.html',
  'ui/pagination/pagination.html',
  'ui/preview/preview.html',
  'ui/relationInstances/relationInstances.html',
  'ui/settings/settings.html',
  'ui/shortcuts/shortcuts.html',
  'ui/status/status.html',
  'ui/survey/survey.html',
  'ui/topbar/topbar.html',
  'ui/topbar/topbarbutton.html'
]);
angular.module('ui/classInstances/classInstances.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/classInstances/classInstances.html', '<div id="class-instances" ng-show="showInstances">\n' + '\t\t<div id="facetblock">\n' + '\t\t\t<div id="facettitleblock" class="top-block">Faceted Browser</div>\n' + '\t\t\t<div id="facettreeblock" class="top-block"><div class="titletext">Facets</div><div facet-tree sparql-service="sparqlService" facet-tree-config="facetTreeConfig" select="selectFacet(path)"></div></div>\n' + '\t\t\t<div id="facetvaluesblock" class="top-block"><div class="titletext">Values</div><div facet-value-list sparql-service="sparqlService" facet-tree-config="facetTreeConfig" path="path"></div>\t</div>\n' + '\t\t\t<div id="facetconstraintsblock" class="top-block"><div class="titletext">Constraints</div><div constraint-list sparql-service="sparqlService" facet-tree-config="facetTreeConfig"></div></div>\n' + '\t\t</div>\n' + '\t\t<div id="instance-block" class="top-block"><div id="class-instances-top">Some instances of this class:</div><div id="class-instances"><div class="class-instance-i" dbpv-pagination page="page" total="total" perpage="perpage"></div><div ng-repeat="instance in instances"><div class="class-instance-i"><div class="class-instance"><div display-node node="instance" primarylang="primarylang" fallbacklang="fallbacklang"></div></div></div></div></div></div></div>');
  }
]);
angular.module('ui/custom/custom.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/custom/custom.html', '<div id="smartSlider"><div id="smartSlider-title">{{title}}</div><div id="smartSlider-content" compile="content"></div></div>');
  }
]);
angular.module('ui/densor/densor.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/densor/densor.html', '<div class="densor">\n' + '\t<div class="densor-grid">\n' + '\t\t<div ng-repeat="bucket in buckets" class="densor-col">\n' + '\t\t\t\n' + '\t\t</div>\n' + '\t</div>\n' + '</div>');
  }
]);
angular.module('ui/disclaimer/disclaimer.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/disclaimer/disclaimer.html', '<div id="ft_ccbysa" ng-show="disclaimed">\tThis content was extracted from <a href="http://www.wikipedia.org">Wikipedia</a> and is licensed under the <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>\t</br>\tThe content on this page was created by the <a href="{{wikipage.history}}">editors of the Wikipedia page {{wikipage.title}}</a>.      </div>');
  }
]);
angular.module('ui/filters/predicateFilter.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/filters/predicateFilter.html', '<input class="form-control dbpv-input dbpv-filter dbpv-filter-pred" ng-model="predfilter" data-intro="Filter predicates using a string." data-step="4"/>');
  }
]);
angular.module('ui/filters/valueFilter.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/filters/valueFilter.html', '<input class="form-control dbpv-input dbpv-filter dbpv-filter-val" ng-model="valfilter" data-intro="Filter values using a string." data-step="5"/>');
  }
]);
angular.module('ui/languageSwitch/languageSwitch.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/languageSwitch/languageSwitch.html', '<div data-intro="Filter by language." data-step="2" class="input-group-btn dropdown">\t\t\t\t\t<button type="button" class="btn btn-default dropdown-toggle language-button" data-toggle="dropdown"><span style="font-size:0.8em;" class="glyphicon glyphicon-globe"></span> <span ng-bind="getNativeName(primarylanguage);"></span></button>\t\t\t\t        <ul class="dropdown-menu">\t\t\t\t\t  <li ng-repeat="(code, names) in availableLanguages"><a href="javascript:void(0);" ng-click="selectLanguage(code);">{{names.nativeName}}</a></li>\t\t\t\t\t  <li class="divider"></li>\t\t\t\t\t  <li class="unavailable" ng-repeat="(code, names) in restLanguages()"><a href="javascript:void(0);" ng-click="selectLanguage(code);">{{names.nativeName}}</a></li>\t\t\t\t\t</ul>\t\t\t\t</div>');
  }
]);
angular.module('ui/legend/legend.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/legend/legend.html', '<div id="legend" ><h2 style="margin-top:0;">Legend</h2>\t<div class="container" id="legends">\t\t<div class="legend" ng-repeat="legend in legends">\t\t\t<div class="name">{{legend.name}}</div>\t\t\t<div class="description">{{legend.description}}</div>\t\t\t<div class="line" ng-repeat="line in legend.lines">\t\t\t\t<span ng-bind-html="line.icon"></span> : {{line.text}}\t\t\t</div>\t\t</div>\t</div></div>');
  }
]);
angular.module('ui/lookup/lookup.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/lookup/lookup.html', '<input data-intro="Search for entities." data-step="1" type="text" typeahead="result as result.l_label for result in lookup()" typeahead-wait-ms="800" typeahead-template-url="tpl/typeahead-custom.html" placeholder="Search..." class="form-control entity-search dbpv-input" ng-model="querie"/>');
  }
]);
angular.module('ui/notifications/notifications.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/notifications/notifications.html', '<div id="notifications">\t\t\t\t\n' + '\t<div class="notification" ng-click="removeNotification(notification);" ng-repeat="notification in notifications">\t\t\t\t\t\n' + '\t\t<span class="text">\n' + '\t\t\t{{notification.text}}\n' + '\t\t</span>\t\t\t\t\n' + '\t</div>\t\t\t\n' + '</div>');
  }
]);
angular.module('ui/pagination/pagination.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/pagination/pagination.html', '<div class="dbpv-paginator" ng-show="showPaginator">\n' + '\t\t\t\t\t\t<div ng-show="showLeftNav">\n' + '\t\t\t\t\t\t\t<button class="btn btn-block-primary btn-small btn-show-left dbpv-btn" ng-click="onShowLeft()">\n' + '\t\t\t\t\t\tPREVIOUS\n' + '\t\t\t\t\t\t\t</button>\n' + '\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t<div ng-show="!showLeftNav">\n' + '\t\t\t\t\t\t\t<button class="btn btn-block-primary btn-small btn-show-left dbpv-btn" disabled="disabled">\n' + '\t\t\t\t\t\t&nbsp\n' + '\t\t\t\t\t\t\t</button>\n' + '\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t<div ng-show="showPaginator">\n' + '\t\t\t\t\t\t\t<div class="rev-paginator">PAGE:\n' + '\t\t\t\t\t\t\t\t<input class="form-control dbpv-input dbpv-filter rev-paginator-page" ng-model="pagedis" ng-enter="changePage()"/>/{{pages+1}} \n' + '\t\t\t\t\t\t\t\t<button class="btn dbpv-btn btn-block-primary btn-small" ng-click="changePage()">\n' + '\t\t\t\t\t\t\t\tGO\n' + '\t\t\t\t\t\t\t\t</button>\n' + '\t\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t<div ng-show="showRightNav">\n' + '\t\t\t\t\t<button class="btn btn-block-primary btn-small btn-show-right dbpv-btn" ng-click="onShowRight()">\n' + '\t\t\t\t\tNEXT\n' + '\t\t\t\t\t\t\t</button>\n' + '\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t\t<div ng-show="!showRightNav">\n' + '\t\t\t\t\t\t\t<button class="btn btn-block-primary btn-small btn-show-right dbpv-btn" disabled="disabled">\n' + '\t\t\t\t\t&nbsp\n' + '\t\t\t\t\t\t\t</button>\n' + '\t\t\t\t\t\t</div>\n' + '\t\t\t\t\t</div>');
  }
]);
angular.module('ui/preview/preview.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/preview/preview.html', '<div ng-show="dbpvp.show" id="dbpvpreview" style="position:absolute;top:{{dbpvp.top}}px;left:{{dbpvp.left}}px;" ng-mouseenter="previewHover()" ng-mouseleave="previewUnhover()">\n' + '\t<div id="dbpvpthumbnail">\t\t\t\t<img ng-src="{{dbpvp.thumbnail[0].value}}"></img\t\t\t</div>\n' + '\t<div id="dbpvptext">\t\t\t\n' + '\t\t<div id="dbpvplabel">\t\t\t\t<span ng-repeat="value in dbpvp.label |languageFilter:primarylang:fallbacklang">\t\t\t\t\t{{value.value}}\t\t\t\t</span>\t\t\t</div>\t\t\t\n' + '\t\t<div id="dbpvpdescription">\t\t\t\t<span ng-repeat="value in dbpvp.description |languageFilter:primarylang:fallbacklang">\t\t\t\t\t{{value.value}}\t\t\t\t</span>\t\t\t</div>\t\t\t\n' + '\t</div>\n' + '\t<div ng-repeat="(key, val) in dbpvp.properties">\t\t\t\t\n' + '\t\t<div id="dbpvpdescription">\t\t\t\t\t<span ng-show="val.length>0">\t\t\t\t\t\t{{key}}:\t\t\t\t\t\t<a href="{{val.uri}}">\t\t\t\t\t\t\t{{val.lex}}\t\t\t\t\t\t</a>\t\t\t\t\t</span>\t\t\t\t</div>\t\t\t\n' + '\t</div>\t\n' + '</div>');
  }
]);
angular.module('ui/relationInstances/relationInstances.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/relationInstances/relationInstances.html', '<div id="relation-instances" class="top-block" ng-show="showInstances"><div id="relation-instances-top">Some relation instances</div><div id="relation-instances"><div ng-repeat="instance in instances"><div class="relation-instance"><div class="relation-instance-subject"><div display-node node="instance.subj" primarylang="primarylang" fallbacklang="fallbacklang"></div></div><div class="relation-instance-object"><div display-node node="instance.obj" primarylang="primarylang" fallbacklang="fallbacklang"></div></div></div></div></div></div>');
  }
]);
angular.module('ui/settings/settings.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/settings/settings.html', '<div id="dbpv-settings"><h2 style="margin-top:0;">Settings:</h2><div ng-repeat="setting in settings"><div class="form-group" ng-switch="setting.type"><div ng-switch-when="string"><label>{{setting.label}}</label><input type="text" class="form-control" ng-model="setting.value"/></div><div ng-switch-when="boolean" class="checkbox"><label><input type="checkbox" ng-model="setting.value">{{setting.label}}</label></div></div></div><button class="btn btn-small btn-primary" ng-click="refresh()">SAVE SETTINGS & REFRESH</button><button class="btn btn-small btn-danger" ng-click="reset()" style="float:right">RESET</button></div>');
  }
]);
angular.module('ui/shortcuts/shortcuts.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/shortcuts/shortcuts.html', '<div id="shortcutswrapper">\t\t\t\t\t\t<div id="shortcuts" stupid-scroll="100" ng-show="shortcuts.length>0" style="top:100px;">\t\t\t\t\t\t\t<div class="shortcut-home" dbpv-top></div>\t\t\t\t\t\t\t<div class="shortcutscuts" data-intro="These are shortcuts to some basic entity properties." data-step="6">\t\t\t\t\t\t\t\t<div class="shortcut" ng-repeat="cut in shortcuts">\t\t\t\t\t\t\t\t\t<span shortcut="cut.url" shortcut-label="cut.label"></span>\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<div class="shortcutscuts"></div>\t\t\t\t\t\t</div>\t\t\t\t\t</div>');
  }
]);
angular.module('ui/status/status.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/status/status.html', '<div id="dbpv-status"><div ng-repeat="status in stasi" class="status-item"><span ng-bind-html="status.icon" ng-click="removeStatus(status)"></span><span>{{status.text}}</span></div></div>');
  }
]);
angular.module('ui/survey/survey.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/survey/survey.html', '<div id="survey" ng-if="showSurvey"><img class="btn-survey" src="css/surveyrequest.png" ng-click="surveyClicked()"/></div>');
  }
]);
angular.module('ui/topbar/topbar.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/topbar/topbar.html', '<div class="navbar top-block"> \t\t<div class="dbp-logo">\t\t\t<img ng-src="{{logo}}"></img> \t\t</div> \t\t<div id="searchbar">\t  \t\t\t<div class="input-group" id="topstuff">\t\t\t\t<span class="input-group-addon glyphicon glyphicon-search"></span>\t\t\t\t<div dbpv-lookup lookupgraph="lookupgraph" lookupendpoint="lookupendpoint" localprefix="localprefix"></div> \t\t\t\t<span class="input-group-addon addon-right" title="This is the Named Graph">@ {{localgraph}}</span>\t\t\t\t<div dbpv-language-switch primarylang="primarylang" languages="languages"></div>\t\t\t</div>\t\t\t\t\t</div> <div dbpv-topbuttons></div></div>');
  }
]);
angular.module('ui/topbar/topbarbutton.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('ui/topbar/topbarbutton.html', '<div id="dbpv-topbuttons"><span ng-repeat="button in buttons"><div class="dbpv-topbutton {{buttonActive(button)}}" id="{{button.css-id}}" title="{{button.description}}" ng-click="buttonClicked(button)" compile="button.display"></div></span><div ng-show="showContent" class="dbpv-rightcol top-block" compile="content"></div></div>');
  }
]);