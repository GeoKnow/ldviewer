angular.module('ldv.templates.pretty', ['pretty/prettyLinks/prettyLinks.html', 'pretty/prettyList/prettyList.html', 'pretty/prettyMap/prettyMap.html', 'pretty/prettyTypes/prettyTypes.html', 'pretty/prettybox/prettybox.html']);

angular.module("pretty/prettyLinks/prettyLinks.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pretty/prettyLinks/prettyLinks.html",
    "<div id=\"dbpvplinks\">			\n" +
    "<div ng-repeat=\"(label, list) in links\" style=\"float:left;margin-right: 15px;\">				<div ng-show=\"list.length>1\" >					\n" +
    "\n" +
    "<a role=\"button\" href=\"javascript:void(0);\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">{{label}} \n" +
    "	<span class=\"glyphicon glyphicon-chevron-down\" style=\"font-size:0.6em;\"></span>\n" +
    "</a>					\n" +
    "<ul class=\"dropdown-menu\">						\n" +
    "	<li ng-repeat=\"link in list\"><a target=\"_blank\" href=\"{{link.uri}}\">{{link.plex}}</a></li>									\n" +
    "</ul>			\n" +
    "\n" +
    "</div>				<div ng-show=\"list.length==1\">					<a target=\"_blank\" href=\"{{list[0].uri}}\">{{list[0].plex}}</a>				</div>			</div>		</div>");
}]);

angular.module("pretty/prettyList/prettyList.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pretty/prettyList/prettyList.html",
    "<div id=\"dbpvpproperties\" ng-show=\"showProperties()\"><table id=\"dbpvplist\"><tr ng-repeat=\"property in properties | orderBy:prioSort\" class=\"propertyentry\"><td class=\"propertykey\"><div display-node settings=\"\" showlanguage=\"false\" node=\"property.key\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></div>:</td><td  class=\"propertyvalues\"><div ng-repeat=\"value in property.values\"><div display-node node=\"value\" settings=\"displayset\" class=\"propertyvalue\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\" showlanguage=\"false\" dbpv-preview></div></div></div></td></tr></table></div>");
}]);

angular.module("pretty/prettyMap/prettyMap.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pretty/prettyMap/prettyMap.html",
    "<div id=\"dbpvpmapcontainer\" class=\"top-block\"><div id=\"dbpvpmap\"></div></div>");
}]);

angular.module("pretty/prettyTypes/prettyTypes.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pretty/prettyTypes/prettyTypes.html",
    "<div id=\"dbpvptypes\" ng-show=\"types.length>0\"><span class=\"dbpvptype\" ng-repeat=\"type in types\"><span pretty-type node=\"type\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\" owlgraph=\"owlgraph\" owlendpoint=\"owlendpoint\"></span><span class=\"comma\">, </span></span></div>");
}]);

angular.module("pretty/prettybox/prettybox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pretty/prettybox/prettybox.html",
    "<div>\n" +
    "	<div id=\"dbpvpthumbnail\"><img ng-src=\"{{dbpvp.thumbnail[0].uri}}\"></img>	</div>	<div id=\"dbpvptext\">		\n" +
    "		<div id=\"dbpvplabel\">			\n" +
    "			<span ng-repeat=\"value in dbpvp.label |languageFilter:primarylang:fallbacklang\">				\n" +
    "				<a href=\"{{about.uri}}\">{{value.literalLabel.lex}}</a>			\n" +
    "			</span>		\n" +
    "		</div>		\n" +
    "		<div pretty-types types=\"dbpvp.types\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\" owlgraph=\"owlgraph\" owlendpoint=\"owlendpoint\"></div>		\n" +
    "		<div id=\"dbpvpdescription\">			\n" +
    "			<span ng-repeat=\"value in dbpvp.description |languageFilter:primarylang:fallbacklang\">				\n" +
    "				{{value.literalLabel.lex}}			\n" +
    "			</span>		\n" +
    "		</div>		\n" +
    "		<div pretty-links links=\"dbpvp.links\"></div> \n" +
    "		<div dbpvp-list properties=\"dbpvp.properties\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\">\n" +
    "		</div>\n" +
    "		<div id=\"loading\" ng-show=\"entitySemaphore>0\">			\n" +
    "			<center><img style=\"margin-bottom:15px;\" src=\"/statics/css/ajax-loader.gif\"></img></center>		\n" +
    "		</div>	\n" +
    "	</div>\n" +
    "</div>");
}]);
