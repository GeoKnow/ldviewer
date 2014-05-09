angular.module('ldv.ui.custom', ['ldv.templates.ui'])
.directive('dbpvTop', function ($compile) {
	return {
		link:	function (scope, element, attrs) {
				scope.goHome = function() {
					$('body,html').animate({scrollTop: 0}, 800);
					return false;
				}
				element.html("<a href='javascript:void(0);' ng-click='goHome();'><span class='glyphicon glyphicon-chevron-up'></span></a>");
				$compile(element.contents())(scope);
				
				if ($(window).scrollTop() < 150) {
					element.css("visibility","hidden");
				}

				$(window).scroll( function () {
					if ($(window).scrollTop() > 150) {
						element.css("visibility","visible");
					}else{
						element.css("visibility","hidden");
					}

				});
			}
		};
})

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
})

.directive('sameOffset', function () {
	return {
		link:	function (scope, element, attrs) {
			var idToWatch = attrs.sameOffset;
			scope.$watch(
				function () {
					return angular.element(idToWatch).offset().top;
				},
				function (top) {
					element.css("top", top);
					//element.attr("smartscrollinit", top);
				}
			);
		}
	};
})

.directive('stupidScroll', function($window) {
	return {
		link:	function (scope, element, attrs) {
					/*$(window).scroll (function() {
						if ($(window).scrollTop() > attrs.stupidScroll) {
							element.offset({"top":$(window).scrollTop(), "left": 0});
						}
					});*/
				}
	};
})

.directive('smartScroll', function ($window) {
	return {
		link:	function (scope, element, attrs) {
				var prevset = 0;
				var inittop = 0;
				var scrolled = false;
				var inittop = attrs.smartScroll;
				if (inittop !== undefined) element.offset({"top": inittop, 'left':element.offset().left});
				//alert(JSON.stringify(element.offset()));
				$(window).scroll (function () {
					if (inittop === undefined) inittop = attrs.smartScroll;
					if (inittop === undefined) inittop = element.attr("smartscrollinit");
					if (inittop === undefined) inittop = 0;
					var down = $(window).scrollTop() > prevset;
					prevset = $(window).scrollTop();

					var winh = $(window).height();
					var wins = $(window).scrollTop();
					var eleh = element.height();
					var eles = element.offset().top;
					var elel = element.offset().left;
					// distance top of element -> top of window
					var eletopmar = wins-eles;
					// distance bottom of window -> bottom element
					var elebotmar = eles+eleh-wins-winh;

					var cantop = wins;
					
					if (eleh > winh) {
						if (down) {
							if (eletopmar > 0) {
								var canelebotmar = elebotmar + eletopmar;
								if (elebotmar < 0) {
									cantop = wins - canelebotmar;
								}else{
									cantop = undefined;
								}						
							}
						}else{
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
							element.offset({"top":cantop, "left": elel});
						}else{
							element.offset({"top":inittop, "left": elel});
						}
					}
				});
			}
		};
})

.directive('smartSlide', function () {
	return {
		link: 	function (scope, element, attrs) {
					var root = attrs.id;
					var original = $("#"+root+" "+attrs.smartSlideContent).css("right");
					$("#"+root+" "+attrs.smartSlideContent).hide();
					$("#"+root+" "+attrs.smartSlide).click( function() {
						var a = $("#"+root+" "+attrs.smartSlideContent).css("right");
						var a = a.substr(0, a.length-2);
						if ( a < 0) {
							$("#"+root+" "+attrs.smartSlideContent).show();
							$("#"+root+" "+attrs.smartSlideContent).animate({
								right: "0px"
							}, 200);
						} else {
							$("#"+root+" "+attrs.smartSlideContent).animate({
								right: original
							}, 200, function() {$("#"+root+" "+attrs.smartSlideContent).hide();});
						}
					});
				}
	};
})

.directive('smartSlider', function() {
	return {
		restrict: 	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						content:	"=",
						title:		"=",
						state:		"="
					},
		controller:	"SmartSliderCtrl",
		templateUrl:	'ui/custom/custom.html'
	};
})
	
	.controller('SmartSliderCtrl', ['$scope', function($scope) {
		$scope.currentState = false;
	
		$scope.$watch("state", function(state) {
			if (state != $scope.currentState) {
				$scope.updateSlider();
			}
		});
		
		$scope.updateSlider = function() {
			if ($scope.state==true && $scope.currentState == false) {
				$scope.showSlider();
			} else if ($scope.state = false && $scope.currentState == true) {
				$scope.hideSlider();
			}
		};
		
		$scope.showSlider = function() {
			
		};
		
		$scope.hideSlider = function() {
		
		};
	}])

;
