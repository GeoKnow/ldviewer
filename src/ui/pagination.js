var pagination = angular.module('ldv.ui.pagination', ['ldv.ui.custom']);

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
		template:	'<div class="dbpv-paginator" ng-show="showPaginator">'+
					'	<div ng-show="showLeftNav">'+
					'		<button class="btn btn-block-primary btn-small btn-show-left dbpv-btn" ng-click="onShowLeft()">'+
								'PREVIOUS'+
					'		</button>'+
					'	</div>'+
					'	<div ng-show="!showLeftNav">'+
					'		<div class="btn-show-left-placeholder">'+
								'PREVIOUS'+
					'		</div>'+
					'	</div>'+
					'	<div ng-show="showPaginator">'+
						'	<div class="rev-paginator">PAGE: '+
						'		<input class="form-control dbpv-input dbpv-filter rev-paginator-page" ng-model="pagedis" ng-enter="changePage()"/>/{{pages+1}} '+
						'		<button class="btn dbpv-btn btn-block-primary btn-small" ng-click="changePage()">'+
									'GO'+
						'		</button>'+
						'	</div>'+
						'</div>'+
						'<div ng-show="showRightNav">'+
							'<button class="btn btn-block-primary btn-small btn-show-right dbpv-btn" ng-click="onShowRight()">'+
								'NEXT'+
					'		</button>'+
					'	</div>'+
					'	<div ng-show="!showRightNav">'+
					'		<div class="btn-show-right-placeholder">'+
								'NEXT'+
					'		</div>'+
					'	</div>'+
					'</div>',
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

