angular.module('ldv.templates.ui', ['ui/classInstances/classInstances.html', 'ui/custom/custom.html', 'ui/disclaimer/disclaimer.html', 'ui/filters/predicateFilter.html', 'ui/filters/valueFilter.html', 'ui/languageSwitch/languageSwitch.html', 'ui/legend/legend.html', 'ui/lookup/lookup.html', 'ui/notifications/notifications.html', 'ui/pagination/pagination.html', 'ui/preview/preview.html', 'ui/relationInstances/relationInstances.html', 'ui/settings/settings.html', 'ui/shortcuts/shortcuts.html', 'ui/status/status.html', 'ui/survey/survey.html', 'ui/topbar/topbar.html', 'ui/topbar/topbarbutton.html']);

angular.module("ui/classInstances/classInstances.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/classInstances/classInstances.html",
    "<div id=\"class-instances\" ng-show=\"showInstances\">\n" +
    "		<div id=\"facetblock\">\n" +
    "			<div id=\"facettitleblock\" class=\"top-block\">Faceted Browser</div>\n" +
    "			<div id=\"facettreeblock\" class=\"top-block\"><div class=\"titletext\">Facets</div><div facet-tree sparql-service=\"sparqlService\" facet-tree-config=\"facetTreeConfig\" select=\"selectFacet(path)\"></div></div>\n" +
    "			<div id=\"facetvaluesblock\" class=\"top-block\"><div class=\"titletext\">Values</div><div facet-value-list sparql-service=\"sparqlService\" facet-tree-config=\"facetTreeConfig\" path=\"path\"></div>	</div>\n" +
    "			<div id=\"facetconstraintsblock\" class=\"top-block\"><div class=\"titletext\">Constraints</div><div constraint-list sparql-service=\"sparqlService\" facet-tree-config=\"facetTreeConfig\"></div></div>\n" +
    "		</div>\n" +
    "		<div id=\"instance-block\" class=\"top-block\"><div id=\"class-instances-top\">Some instances of this class:</div><div id=\"class-instances\"><div class=\"class-instance-i\" dbpv-pagination page=\"page\" total=\"total\" perpage=\"perpage\"></div><div ng-repeat=\"instance in instances\"><div class=\"class-instance-i\"><div class=\"class-instance\"><div display-node node=\"instance\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></div></div></div></div></div></div></div>");
}]);

angular.module("ui/custom/custom.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/custom/custom.html",
    "<div id=\"smartSlider\"><div id=\"smartSlider-title\">{{title}}</div><div id=\"smartSlider-content\" compile=\"content\"></div></div>");
}]);

angular.module("ui/disclaimer/disclaimer.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/disclaimer/disclaimer.html",
    "<div id=\"ft_ccbysa\" ng-show=\"disclaimed\">	This content was extracted from <a href=\"http://www.wikipedia.org\">Wikipedia</a> and is licensed under the <a href=\"http://creativecommons.org/licenses/by-sa/3.0/\">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>	</br>	The content on this page was created by the <a href=\"{{wikipage.history}}\">editors of the Wikipedia page {{wikipage.title}}</a>.      </div>");
}]);

angular.module("ui/filters/predicateFilter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/filters/predicateFilter.html",
    "<input class=\"form-control dbpv-input dbpv-filter dbpv-filter-pred\" ng-model=\"predfilter\" data-intro=\"Filter predicates using a string.\" data-step=\"4\"/>");
}]);

angular.module("ui/filters/valueFilter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/filters/valueFilter.html",
    "<input class=\"form-control dbpv-input dbpv-filter dbpv-filter-val\" ng-model=\"valfilter\" data-intro=\"Filter values using a string.\" data-step=\"5\"/>");
}]);

angular.module("ui/languageSwitch/languageSwitch.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/languageSwitch/languageSwitch.html",
    "<div data-intro=\"Filter by language.\" data-step=\"2\" class=\"input-group-btn\">					<button type=\"button\" class=\"btn btn-default dropdown-toggle language-button\" data-toggle=\"dropdown\"><span style=\"font-size:0.8em;\" class=\"glyphicon glyphicon-globe\"></span> <span ng-bind=\"getNativeName(primarylanguage);\"></span></button>				        <ul class=\"dropdown-menu\">					  <li ng-repeat=\"(code, names) in availableLanguages\"><a href=\"javascript:void(0);\" ng-click=\"selectLanguage(code);\">{{names.nativeName}}</a></li>					  <li class=\"divider\"></li>					  <li class=\"unavailable\" ng-repeat=\"(code, names) in restLanguages()\"><a href=\"javascript:void(0);\" ng-click=\"selectLanguage(code);\">{{names.nativeName}}</a></li>					</ul>				</div>");
}]);

angular.module("ui/legend/legend.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/legend/legend.html",
    "<div id=\"legend\" ><h2 style=\"margin-top:0;\">Legend</h2>	<div class=\"container\" id=\"legends\">		<div class=\"legend\" ng-repeat=\"legend in legends\">			<div class=\"name\">{{legend.name}}</div>			<div class=\"description\">{{legend.description}}</div>			<div class=\"line\" ng-repeat=\"line in legend.lines\">				<span ng-bind-html=\"line.icon\"></span> : {{line.text}}			</div>		</div>	</div></div>");
}]);

angular.module("ui/lookup/lookup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/lookup/lookup.html",
    "<input data-intro=\"Search for entities.\" data-step=\"1\" type=\"text\" typeahead=\"result as result.l_label for result in lookup()\" typeahead-wait-ms=\"800\" typeahead-template-url=\"tpl/typeahead-custom.html\" placeholder=\"Search...\" class=\"form-control entity-search dbpv-input\" ng-model=\"querie\"/>");
}]);

angular.module("ui/notifications/notifications.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/notifications/notifications.html",
    "<div id=\"notifications\">				\n" +
    "	<div class=\"notification\" ng-click=\"removeNotification(notification);\" ng-repeat=\"notification in notifications\">					\n" +
    "		<span class=\"text\">\n" +
    "			{{notification.text}}\n" +
    "		</span>				\n" +
    "	</div>			\n" +
    "</div>");
}]);

angular.module("ui/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/pagination/pagination.html",
    "<div class=\"dbpv-paginator\" ng-show=\"showPaginator\">\n" +
    "						<div ng-show=\"showLeftNav\">\n" +
    "							<button class=\"btn btn-block-primary btn-small btn-show-left dbpv-btn\" ng-click=\"onShowLeft()\">\n" +
    "						PREVIOUS\n" +
    "							</button>\n" +
    "						</div>\n" +
    "						<div ng-show=\"!showLeftNav\">\n" +
    "							<button class=\"btn btn-block-primary btn-small btn-show-left dbpv-btn\" disabled=\"disabled\">\n" +
    "						&nbsp\n" +
    "							</button>\n" +
    "						</div>\n" +
    "						<div ng-show=\"showPaginator\">\n" +
    "							<div class=\"rev-paginator\">PAGE:\n" +
    "								<input class=\"form-control dbpv-input dbpv-filter rev-paginator-page\" ng-model=\"pagedis\" ng-enter=\"changePage()\"/>/{{pages+1}} \n" +
    "								<button class=\"btn dbpv-btn btn-block-primary btn-small\" ng-click=\"changePage()\">\n" +
    "								GO\n" +
    "								</button>\n" +
    "							</div>\n" +
    "						</div>\n" +
    "						<div ng-show=\"showRightNav\">\n" +
    "					<button class=\"btn btn-block-primary btn-small btn-show-right dbpv-btn\" ng-click=\"onShowRight()\">\n" +
    "					NEXT\n" +
    "							</button>\n" +
    "						</div>\n" +
    "						<div ng-show=\"!showRightNav\">\n" +
    "							<button class=\"btn btn-block-primary btn-small btn-show-right dbpv-btn\" disabled=\"disabled\">\n" +
    "					&nbsp\n" +
    "							</button>\n" +
    "						</div>\n" +
    "					</div>");
}]);

angular.module("ui/preview/preview.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/preview/preview.html",
    "<div ng-show=\"dbpvp.show\" id=\"dbpvpreview\" style=\"position:absolute;top:{{dbpvp.top}}px;left:{{dbpvp.left}}px;\" ng-mouseenter=\"previewHover()\" ng-mouseleave=\"previewUnhover()\">\n" +
    "	<div id=\"dbpvpthumbnail\">				<img ng-src=\"{{dbpvp.thumbnail[0].value}}\"></img			</div>\n" +
    "	<div id=\"dbpvptext\">			\n" +
    "		<div id=\"dbpvplabel\">				<span ng-repeat=\"value in dbpvp.label |languageFilter:primarylang:fallbacklang\">					{{value.value}}				</span>			</div>			\n" +
    "		<div id=\"dbpvpdescription\">				<span ng-repeat=\"value in dbpvp.description |languageFilter:primarylang:fallbacklang\">					{{value.value}}				</span>			</div>			\n" +
    "	</div>\n" +
    "	<div ng-repeat=\"(key, val) in dbpvp.properties\">				\n" +
    "		<div id=\"dbpvpdescription\">					<span ng-show=\"val.length>0\">						{{key}}:						<a href=\"{{val.uri}}\">							{{val.lex}}						</a>					</span>				</div>			\n" +
    "	</div>	\n" +
    "</div>");
}]);

angular.module("ui/relationInstances/relationInstances.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/relationInstances/relationInstances.html",
    "<div id=\"relation-instances\" class=\"top-block\" ng-show=\"showInstances\"><div id=\"relation-instances-top\">Some relation instances</div><div id=\"relation-instances\"><div ng-repeat=\"instance in instances\"><div class=\"relation-instance\"><div class=\"relation-instance-subject\"><div display-node node=\"instance.subj\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></div></div><div class=\"relation-instance-object\"><div display-node node=\"instance.obj\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></div></div></div></div></div></div>");
}]);

angular.module("ui/settings/settings.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/settings/settings.html",
    "<div id=\"dbpv-settings\"><h2 style=\"margin-top:0;\">Settings:</h2><div ng-repeat=\"setting in settings\"><div class=\"form-group\" ng-switch=\"setting.type\"><div ng-switch-when=\"string\"><label>{{setting.label}}</label><input type=\"text\" class=\"form-control\" ng-model=\"setting.value\"/></div><div ng-switch-when=\"boolean\" class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"setting.value\">{{setting.label}}</label></div></div></div><button class=\"btn btn-small btn-primary\" ng-click=\"refresh()\">SAVE SETTINGS & REFRESH</button><button class=\"btn btn-small btn-danger\" ng-click=\"reset()\" style=\"float:right\">RESET</button></div>");
}]);

angular.module("ui/shortcuts/shortcuts.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/shortcuts/shortcuts.html",
    "<div id=\"shortcutswrapper\">						<div id=\"shortcuts\" stupid-scroll=\"100\" ng-show=\"shortcuts.length>0\" style=\"top:100px;\">							<div class=\"shortcut-home\" dbpv-top></div>							<div class=\"shortcutscuts\" data-intro=\"These are shortcuts to some basic entity properties.\" data-step=\"6\">								<div class=\"shortcut\" ng-repeat=\"cut in shortcuts\">									<span shortcut=\"cut.url\" shortcut-label=\"cut.label\"></span>								</div>							</div>							<div class=\"shortcutscuts\"></div>						</div>					</div>");
}]);

angular.module("ui/status/status.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/status/status.html",
    "<div id=\"dbpv-status\"><div ng-repeat=\"status in stasi\" class=\"status-item\"><span ng-bind-html=\"status.icon\" ng-click=\"removeStatus(status)\"></span><span>{{status.text}}</span></div></div>");
}]);

angular.module("ui/survey/survey.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/survey/survey.html",
    "<div id=\"survey\" ng-show=\"showSurvey\"><img class=\"btn-survey\" src=\"/statics/surveyrequest.png\" ng-click=\"surveyClicked()\"/></div>");
}]);

angular.module("ui/topbar/topbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/topbar/topbar.html",
    "<div class=\"navbar top-block\"> 		<div class=\"dbp-logo\">			<img ng-src=\"{{logo}}\"></img> 		</div> 		<div id=\"searchbar\">	  			<div class=\"input-group\" id=\"topstuff\">				<span class=\"input-group-addon glyphicon glyphicon-search\"></span>				<div dbpv-lookup lookupgraph=\"lookupgraph\" lookupendpoint=\"lookupendpoint\" localprefix=\"localprefix\"></div> 				<span class=\"input-group-addon addon-right\" title=\"This is the Named Graph\">@ {{localgraph}}</span>				<div dbpv-language-switch primarylang=\"primarylang\" languages=\"languages\"></div>			</div>					</div> <div dbpv-topbuttons></div></div>");
}]);

angular.module("ui/topbar/topbarbutton.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("ui/topbar/topbarbutton.html",
    "<div id=\"dbpv-topbuttons\"><span ng-repeat=\"button in buttons\"><div class=\"dbpv-topbutton {{buttonActive(button)}}\" id=\"{{button.css-id}}\" title=\"{{button.description}}\" ng-click=\"buttonClicked(button)\" compile=\"button.display\"></div></span><div ng-show=\"showContent\" class=\"dbpv-rightcol top-block\" compile=\"content\"></div></div>");
}]);
