angular.module('ldv.services.spotlight', [])
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
;
