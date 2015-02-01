angular.module('ldv.templates.main', ['tpl/entity.html', 'tpl/search.html', 'tpl/test.html']);

angular.module("tpl/entity.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tpl/entity.html",
    "<div id=\"triples\">\n" +
    "<div shortcut-box shortcuts=\"shortcuts\"></div>\n" +
    "\n" +
    "<!--div dbpv-legend actions=\"actions\"></div-->\n" +
    "\n" +
    "<div id=\"pretty-box\" class=\"top-block\" data-intro=\"This is the pretty box. It displays a small selection of entity properties in a pretty way.\" data-step=\"3\">\n" +
    "\n" +
    "	<!--div id=\"entityOptions\">\n" +
    "		<span>\n" +
    "		  <a href=\"javascript:void(0);\" class=\"dropdown-toggle glyphicon glyphicon-th-large\" style=\"font-size:20px\" data-toggle=\"dropdown\"></a>\n" +
    "		  <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "			<li><a href=\"/describe/?uri={{about.uri}}\" target=\"_self\">OpenLink Faceted Browser</a></li>\n" +
    "			<li><a href=\"http://linkeddata.uriburner.com/ode/?uri={{about.uri}}\">OpenLink Data Explorer</a></li>\n" +
    "		  </ul>\n" +
    "		</span>\n" +
    "		\n" +
    "		<span>\n" +
    "		  <a href=\"javascript:void(0);\" class=\"dropdown-toggle dbpvicon dbpvicon-rdf\" data-toggle=\"dropdown\"></a>\n" +
    "		  <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "			<li><a href=\"{{about.datalink}}.rdf\" target=\"_self\">RDF/XML</a></li>\n" +
    "			<li><a href=\"{{about.datalink}}.ntriples\" target=\"_self\">RDF/N-triples</a></li>\n" +
    "			<li><a href=\"{{about.datalink}}.json\" target=\"_self\">RDF/JSON</a></li>\n" +
    "			<li><a href=\"{{about.datalink}}.n3\" target=\"_self\">RDF/N3-Turtle</a></li>\n" +
    "		  </ul>\n" +
    "		</span>\n" +
    "		\n" +
    "		<span>\n" +
    "		  <a href=\"javascript:void(0);\" class=\"dropdown-toggle dbpvicon dbpvicon-json\" data-toggle=\"dropdown\"></a>\n" +
    "		  <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "			<li><a href=\"/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+<{{about.uri}}>&amp;output=application%2Fmicrodata%2Bjson\" target=\"_self\">Microdata/JSON</a></li>\n" +
    "			<li><a href=\"/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+<{{about.uri}}>&amp;output=application%2Fld%2Bjson\" target=\"_self\">JSON-LD</a></li>\n" +
    "			<li><a href=\"{{about.datalink}}.json\"  target=\"_self\">RDF/JSON</a></li>\n" +
    "		  </ul>\n" +
    "		</span>\n" +
    "	</div-->\n" +
    "	\n" +
    "	<div pretty-box about=\"about\" dbpvp=\"dbpvp\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\" owlgraph='owlgraph' owlendpoint=\"owlendpoint\" entity-semaphore=\"entitySemaphore\"></div>\n" +
    "\n" +
    "</div>\n" +
    "<div dbpv-preview-box dbpvp=\"preview\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></div>\n" +
    "\n" +
    "\n" +
    "<div dbpvp-map></div>\n" +
    "\n" +
    "<div id=\"triple-list\">\n" +
    "\n" +
    "<div id=\"triples\">\n" +
    "\n" +
    "	<div display-predicates primarylang=\"primarylang\" fallbacklang=\"fallbacklang\" about=\"about\">\n" +
    "\n" +
    "	</div>\n" +
    "	\n" +
    "	<div dbpv-relation-instances about=\"about\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\">\n" +
    "	</div>\n" +
    "	\n" +
    "	<div dbpv-class-instances about=\"about\" primarylang=\"primarylang\" fallbacklang=\"fallbacklang\"></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<div class=\"footer\">\n" +
    "    <!--div id=\"ft_t\">\n" +
    "        Browse using:\n" +
    "	<a href=\"http://linkeddata.uriburner.com/ode/?uri={{about.uri}}\">OpenLink Data Explorer</a> |\n" +
    "	<a href=\"/describe/?uri={{about.uri}}\">OpenLink Faceted Browser</a>\n" +
    "        &nbsp; &nbsp; Raw Data in:\n" +
    "	\n" +
    "        <a href=\"/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+&lt;{{about.uri}}&gt;&amp;format=text/csv\" target=\"_self\" >CSV</a> | RDF (\n" +
    "        <a href=\"{{about.datalink}}.ntriples\" target=\"_self\" >N-Triples</a> \n" +
    "        <a href=\"{{about.datalink}}.n3\" target=\"_self\" >N3/Turtle</a> \n" +
    "	<a href=\"{{about.datalink}}.json\" target=\"_self\" >JSON</a> \n" +
    "        <a href=\"{{about.datalink}}.rdf\" target=\"_self\" >XML</a> ) | OData (\n" +
    "	<a href=\"{{about.datalink}}.atom\" target=\"_self\" >Atom</a> \n" +
    "	<a href=\"{{about.datalink}}.json\" target=\"_self\" >JSON</a> )| Microdata (\n" +
    "	<a href=\"/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+&lt;{{about.uri}}&gt;&amp;output=application/microdata-json\" target=\"_self\" > JSON</a>\n" +
    "        <a href=\"/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+&lt;{{about.uri}}&gt;&amp;output=text/html\" target=\"_self\" >HTML</a>) |  \n" +
    "        <a href=\"/sparql?default-graph-uri={{localgraph}}&amp;query=DESCRIBE+&lt;{{about.uri}}&gt;&amp;output=application/ld-json\" target=\"_self\" >JSON-LD</a> \n" +
    "\n" +
    "        &nbsp; &nbsp;<a href=\"http://wiki.dbpedia.org/Imprint\">About</a>&nbsp; &nbsp;\n" +
    "      </div--> <!-- #ft_t -->\n" +
    "      <div id=\"ft_b\">\n" +
    "        <a href=\"http://virtuoso.openlinksw.com\" title=\"OpenLink Virtuoso\"><img class=\"powered_by\" src=\"css/virt_power_no_border.png\" alt=\"Powered by OpenLink Virtuoso\"></a>\n" +
    "        <a href=\"http://linkeddata.org/\"><img alt=\"This material is Open Knowledge\" src=\"css/LoDLogo.gif\"></a> &nbsp;\n" +
    "        <a href=\"http://dbpedia.org/sparql\"><img alt=\"W3C Semantic Web Technology\" src=\"css/sw-sparql-blue.png\"></a> &nbsp;  &nbsp;\n" +
    "        <a href=\"http://www.opendefinition.org/\"><img alt=\"This material is Open Knowledge\" src=\"css/od_80x15_red_green.png\"></a>\n" +
    "	<span about=\"\" resource=\"http://www.w3.org/TR/rdfa-syntax\" rel=\"dc:conformsTo\" xmlns:dc=\"http://purl.org/dc/terms/\">\n" +
    "	<a href=\"http://validator.w3.org/check?uri=referer\"><img src=\"http://www.w3.org/Icons/valid-xhtml-rdfa\" alt=\"Valid XHTML + RDFa\" height=\"27\"></a>\n" +
    "	</span>\n" +
    "      </div> <!-- #ft_b -->\n" +
    "	  <div dbpv-disclaimer about=\"about\" localgraph=\"localgraph\"></div>\n" +
    "</div>\n" +
    "\n" +
    "</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("tpl/search.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tpl/search.html",
    "<div class=\"search-results\">\n" +
    "\n" +
    "</div>");
}]);

angular.module("tpl/test.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("tpl/test.html",
    "\n" +
    "	<span class=\"dropdown\">\n" +
    "		<a role=\"button\" href=\"javascript:void(0);\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "			drop the\n" +
    "		</a>\n" +
    "		<ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "			<li><a>beat</a></li>\n" +
    "			<li><a>eggs</a></li>\n" +
    "		</ul>\n" +
    "	</span>\n" +
    "	<span class=\"dropdown btn-group\">\n" +
    "		<a role=\"button\" href=\"javascript:void(0);\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "			drop the\n" +
    "		</a>\n" +
    "		<ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "			<li>beat</li>\n" +
    "			<li>eggs</li>\n" +
    "		</ul>\n" +
    "	</span>");
}]);
