
angular.module('ldv.pretty.links', ['ldv.templates.pretty'])
.directive('prettyLinks', function() {
	return {
		restrict:	"EA",
		transclude:	false,
		replace:	true,
		scope:		{
						links:	"="
					},
		templateUrl:	'pretty/prettyLinks/prettyLinks.html'
	};
});