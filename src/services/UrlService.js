
angular.module('ldv.services.UrlService', [])
.factory('UrlService', ['$rootScope', function($rootScope) {
	return {
		localgraph:	 	function() {return $rootScope.localgraph;},
		endpointgraph:	function() {return $rootScope.endpointgraph;},
		endpoint:		function() {return $rootScope.endpoint;},
		primarylang:	function() {return $rootScope.primarylang;},
		fallbacklang:	function() {return $rootScope.fallbacklang;},
		
		localUrl:	function(url) {
			return $rootScope.localgraph !== undefined && $rootScope.localprefix !== undefined && url.uri.slice(0, $rootScope.localgraph.length) == $rootScope.localgraph;
		},
		
		makeUrl: 	function(uri) {
			var url = {'uri':uri};
			if (this.localUrl(url)) {
				url.uri = url.uri.slice($rootScope.localgraph.length, url.uri.length);
				url.uri = /*"/"+*/$rootScope.localprefix+url.uri;
				url.local = true;
			}
			if ($rootScope.godmode) {
				url.uri = url.uri.replace(/^.*:\/\//, '');
				url.uri = /*"/"+*/$rootScope.localprefix+"/"+url.uri;
			}
			return url;
		},
		
		defaultUri:	function(url) {
			if ($rootScope.localprefix != undefined && url.slice(0, $rootScope.localprefix.length) == $rootScope.localprefix) {
				url = url.slice($rootScope.localprefix.length, url.length);
			}
			var prefixPresent = "http://";
			//prefixPresent = $rootScope.localgraph;
			if ($rootScope.localgraph !== undefined && url.slice(0, prefixPresent.length) == prefixPresent) {
				return url;
			} else {
				return $rootScope.localgraph + url;
			}
		},
		
		prefixify:	function(uri) {
			if (uri !== undefined && uri !== null) {
				for (var prefix in $rootScope.prefixes) {
					if (uri.slice(0, prefix.length) == prefix) {
						pref = $rootScope.prefixes[prefix];
						shor = uri.slice(prefix.length, uri.length);
						return [pref, shor];
					}
				}
			}
		},
		
		/** 
		 * sets rootscope vars if in godmode
		 * returns resource url
		 */
		processResource:	function(params) {
			var resource = "";
			if ($rootScope.godmode) {
				/*if (empty != "") {
					return $rootScope.localgraph + this.processLocalResource(params);
				}//*/
				var host = params.a;
				var resource = "/"+params.b;
				var alphabet = ["c", "d", "e","f","g", "h", "i"];
				for (var i = 0; i<alphabet.length; i++) {
					var letter = alphabet[i];
					if (params[letter] !== undefined) {
						resource += "/" + params[letter];
					}
				}
				var protocol = "http:";
				$rootScope.localgraph = protocol+"//"+host;
				$rootScope.endpointgraph = [$rootScope.localgraph];
				$rootScope.endpoint = $rootScope.localgraph+"/sparql";
				$rootScope.owlgraph = $rootScope.localgraph;
				$rootScope.owlendpoint = $rootScope.endpoint;
			} else {
				resource = this.processLocalResource(params);
			}
			return $rootScope.localgraph+resource;
		},
		
		processLocalResource:	function(params) {
			var resource = "";
			var alphabet = ["a","b","c","d","e","f","g", "h", "i"];
			for (var i = 0; i<alphabet.length; i++) {
				var letter = alphabet[i];
				if (params[letter] !== undefined) {
					resource += "/" + params[letter];
				}
			}
			return resource;
		}
	};
}]);