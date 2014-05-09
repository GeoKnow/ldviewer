
angular.module('ldv.pretty.map', ['ldv.templates.pretty'])
.directive('dbpvpMap', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		templateUrl:	'pretty/prettyMap/prettyMap.html',
		scope:		{
						/*lon:	"=",
						lat:	"="//*/
					},
		controller:	'DbpvpMapCtrl'
	};
})

	.controller('DbpvpMapCtrl', ['$scope', function($scope) {
	// OLD COORDINATES REMAIN !!!
	
		LDViewer.setMapCoord = function(coord) {
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
		$scope.updateCoords = function() {
			//$scope.coordLon = -90.0;
			//$scope.coordLat = 90.0;
			if ($scope.lon && $scope.lat) {
				$('#dbpvpmap').attr('class', 'dbpvpmap-active');
				if ($scope.mapview === undefined) {
					//$scope.mapview.remove();
					$scope.mapview = L.map('dbpvpmap');
					L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
						attribution: "<a href='http://osm.org/copyright'>&copy;</a>"
					}).addTo($scope.mapview);
					
				} else {
					
				}
				
				$scope.mapview.setView([$scope.lon, $scope.lat], 10);
				
				if ($scope.micon === undefined) {
					$scope.micon = L.icon({
						iconUrl: '/css/marker-icon.png',
						shadowUrl:	'/css/marker-shadow.png',
						iconSize:	[25, 41],
						shadowSize:	[41, 41],
						iconAnchor:	[13, 40],
						shadowAnchor: [13,40],
						popupAnchor:  [-3, -50]
					});
				}
				
				if ($scope.marker === undefined) {
					$scope.marker = L.marker([$scope.lon, $scope.lat], {icon: $scope.micon});
					$scope.marker.addTo($scope.mapview);
				} else {				
					$scope.marker.setLatLng([$scope.lon, $scope.lat]);
				}
				
				//TODO DOESN'T WORK WITH AUSTRALIA FOR SOME REASON !!!!!! goes east of japan ---> FIXED???? (dubbele GEORSS coords)
				//if ($scope.marker) alert("no marker");
			}/* else {
				$('#dbpvpmap').removeClass('dbpvpmap-active');
				if (typeof($scope.mapview) != "undefined") {
					$scope.mapview.remove();
				}
				console.log($scope.mapview);
			}//*/
		};
		/*$scope.lon = undefined;
		$scope.lat = undefined;
		$scope.updateCoords();//*/
	}]);

;