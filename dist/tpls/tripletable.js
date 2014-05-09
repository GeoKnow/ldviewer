angular.module('ldv.templates.tripletable', ['triple-table/displayPredicates/displayPredicate.html', 'triple-table/displayPredicates/displayPredicates.html', 'triple-table/displayPredicates/displayReversePredicate.html', 'triple-table/displayValues/displayNodeValues.html', 'triple-table/displayValues/displayReverseNodeValues.html', 'triple-table/tableUI/predicateFilter.html', 'triple-table/tableUI/valueFilter.html', 'triple-table/taf/taf.html', 'triple-table/taf/tripleAction.html']);

angular.module("triple-table/displayPredicates/displayPredicate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("triple-table/displayPredicates/displayPredicate.html",
    "<div><div class=\"pred-name\"><span display-node node=\"predicate\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></span></div><div display-node-values about=\"about\" predicate=\"predicate\" values=\"predicate.values\" valfilter=\"valfilter\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></div></div>");
}]);

angular.module("triple-table/displayPredicates/displayPredicates.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("triple-table/displayPredicates/displayPredicates.html",
    "<div class=\"top-block\"> \n" +
    "						<div id=\"triples-top\">\n" +
    "						<div class=\"predicate\">\n" +
    "								<div class=\"pred-name form-inline\">\n" +
    "									<label class=\"dbpv-tabletop\"> Property:\n" +
    "									</label> \n" +
    "									<span predicate-filter predfilter=\"predfilter\">\n" +
    "									</span>\n" +
    "								</div>\n" +
    "								<div class=\"pred-values\">		\n" +
    "									<div class=\"pred-value form-inline\"> \n" +
    "										<label class=\"dbpv-tabletop\"> Value: \n" +
    "										</label> \n" +
    "										<span value-filter valfilter=\"valfilter\">\n" +
    "										</span>\n" +
    "									</div>	\n" +
    "								</div>	\n" +
    "							</div>\n" +
    "						</div>\n" +
    "						<div class=\"predicate\" ng-repeat=\"(id, predicate) in predicates | predicateFilter:predfilter | predicateValueFilter:valfilter | orderBy:sortPredicates\">\n" +
    "							<div ng-switch on=\"predicate.forward\">\n" +
    "								<div ng-switch-when=\"true\">\n" +
    "									<div display-predicate about=\"about\" predicate=\"predicate\" valfilter=\"valfilter\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\">\n" +
    "									</div>\n" +
    "								</div>\n" +
    "								<div ng-switch-default>\n" +
    "								<div display-reverse-predicate about=\"about\" predicate=\"predicate\" \n" +
    "							valfilter=\"valfilter\"\n" +
    "									primarylang=\"primarylang\" fallbacklang=\"fallbacklang\">\n" +
    "									</div>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "						</div>\n" +
    "					</div>");
}]);

angular.module("triple-table/displayPredicates/displayReversePredicate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("triple-table/displayPredicates/displayReversePredicate.html",
    "<div>\n" +
    "	<div class=\"pred-name\">\n" +
    "		<span display-node node=\"predicate\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></span>\n" +
    "	</div>\n" +
    "	<div display-reverse-node-values about=\"about\" predicate=\"predicate\" values=\"predicate.values\" valfilter=\"valfilter\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></div>\n" +
    "</div>");
}]);

angular.module("triple-table/displayValues/displayNodeValues.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("triple-table/displayValues/displayNodeValues.html",
    "<div class=\"pred-values\"><div class=\"pred-value\" ng-repeat=\"val in vals | orderBy:sortValues\" ng-show=\"val.show\"><span triple-actions=\"val.taf\" about=\"about\" predicate=\"predicate\" value=\"val\"></span> <span display-node node=\"val\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></span></div><div ng-show=\"showButton\"><button class=\"btn btn-block btn-primary btn-small btn-show-more dbpv-btn\" ng-click=\"onShowAll()\">Show All</button></div></div>");
}]);

angular.module("triple-table/displayValues/displayReverseNodeValues.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("triple-table/displayValues/displayReverseNodeValues.html",
    "<div class=\"pred-values\"><div class=\"pred-value\" ng-repeat=\"val in vals | orderBy:sortValues\" ng-show=\"val.show\"><span triple-actions=\"val.taf\" about=\"about\" predicate=\"predicate\" value=\"val\"></span> <span display-node node=\"val\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></span></div>\n" +
    "		<div ng-show=\"!predicate.reverseloaded.loaded\"><button class=\"btn btn-block btn-primary btn-small btn-show-more dbpv-btn\" ng-click=\"onLoadButton()\">LOAD</button></div><div dbpv-pagination page=\"predicate.reverseloaded.page\" total=\"predicate.reverseloaded.count\" perpage=\"limit\" on-select=\"onPageSelect(newpage)\"></div></div>");
}]);

angular.module("triple-table/tableUI/predicateFilter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("triple-table/tableUI/predicateFilter.html",
    "<input class=\"form-control dbpv-input dbpv-filter dbpv-filter-pred\" ng-model=\"predfilter\" data-intro=\"Filter predicates using a string.\" data-step=\"4\"/>");
}]);

angular.module("triple-table/tableUI/valueFilter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("triple-table/tableUI/valueFilter.html",
    "<input class=\"form-control dbpv-input dbpv-filter dbpv-filter-val\" ng-model=\"valfilter\" data-intro=\"Filter values using a string.\" data-step=\"5\"/>");
}]);

angular.module("triple-table/taf/taf.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("triple-table/taf/taf.html",
    "<span class=\"dbpv-taf\"><span ng-repeat=\"action in taf\"><span triple-action=\"action\" value=\"value\" predicate=\"predicate\" about=\"about\"></span></span>");
}]);

angular.module("triple-table/taf/tripleAction.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("triple-table/taf/tripleAction.html",
    "<span><a href=\"javascript:void(0);\" title=\"{{action.description}}\" ng-click=\"action.execute(about, predicate, value);\"> <span ng-bind-html-unsafe=\"action.display();\"></span> </a></span>");
}]);
