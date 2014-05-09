var pagination = angular.module('ldv.ui.pagination', ['ldv.ui.custom', 'ldv.templates.ui']);

pagination.directive('dbpvPagination', function() {
	return {
		restrict:	"EA",
		replace:	true,
		transclude:	false,
		scope:		{
						page:	"=",
						total:	"=",
						perpage:	"=",
						onSelect:	"&"
					},
		templateUrl:	'ui/pagination/pagination.html',
		controller:	'DbpvPaginationCtrl'
	};
})

	.controller('DbpvPaginationCtrl', ['$scope', function($scope) {
		$scope.init = function() {
			$scope.pages = Math.floor($scope.total/$scope.perpage);
		}
		
		$scope.$watch('page', function(page) {
				$scope.pagedis = $scope.page + 1;
		});
		
		/*$scope.$watch('pagedis', function(pagedis) {
			if (pagedis.length > 0)
			$scope.page = pagedis - 1;
		});
		//*/
		
		$scope.$watch('total', function(total) {
			$scope.init();
			$scope.checkVisibility();
		});
		
		$scope.onShowRight = function() {
			var newpage = $scope.page + 1;
			if (newpage <= $scope.pages) {
				$scope.page = newpage;
				$scope.onPageChange();
			}
		};
		
		$scope.onShowLeft = function() {
			var newpage = $scope.page - 1;
			if (newpage >= 0) {
				$scope.page = newpage;
				$scope.onPageChange();
			}
		};
		
		$scope.changePage = function() {
			$scope.page = $scope.pagedis-1;
			if ($scope.page > $scope.pages) {
				$scope.page = $scope.pages;
			} else if ($scope.page < 0) {
				$scope.page = 0;
			}
			$scope.onPageChange();
		};
		
		$scope.onPageChange = function() {
			$scope.checkVisibility();
			$scope.onSelect($scope.page);
		};
		
		$scope.checkVisibility = function() {
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
		
	}])

;

