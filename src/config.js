
LDViewer.configuration = function() {
	dbpv.setConfig("previewMappings", {
		label:		"http://www.w3.org/2000/01/rdf-schema#label",
		thumbnail:	"http://dbpedia.org/ontology/thumbnail",
		description:"http://www.w3.org/2000/01/rdf-schema#comment",
		properties:	{
			Domain:	"http://www.w3.org/2000/01/rdf-schema#domain",
			Range:	"http://www.w3.org/2000/01/rdf-schema#range",
			Superclass:	"http://www.w3.org/2000/01/rdf-schema#subClassOf"
		}
	});
	
	dbpv.setConfig('prefixes', {
		"http://dbpedia.org/resource/": "dbpedia",
		"http://www.w3.org/1999/02/22-rdf-syntax-ns#": "rdf",
		"http://www.w3.org/2000/01/rdf-schema#": "rdfs",
		"http://xmlns.com/foaf/0.1/": "foaf",
		"http://dbpedia.org/ontology/": "dbpedia-owl",
		"http://dbpedia.org/property/": "dbpprop",
		"http://dbpedia.org/resource/Category:": "category",
		"http://dbpedia.org/class/yago/": "yago",
		"http://www.w3.org/2001/XMLSchema#": "xsd",
		"http://linkedgeodata.org/ontology/": "lgdo",
		"http://linkedgeodata.org/meta/":	"lgd-meta",
		"http://linkedgeodata.org/geometry/":	"lgd-geometry",
		"http://linkedgeodata.org/triplify/":	"lgd-triplify",
		"http://linkedgeodata.org/":	"lgd",
		"http://www.w3.org/2002/07/owl#":	"owl"
	});
	
	dbpv.setConfig('entitySemaphore', 0);

	dbpv.setConfig('localprefix' , "#");
	
	dbpv.setConfig('godmode' , false);
	
	dbpv.setConfig('localgraph', "http://dbpedia.org");
	dbpv.setConfig('endpointgraph', []);
	
	dbpv.setConfig('endpoint', "http://dbpedia.org/sparql");
	dbpv.setConfig('encodegraph', true);

	dbpv.setConfig('owlgraph', "http://dbpedia.org");
	dbpv.setConfig('owlendpoint', "http://dbpedia.org/sparql");
	
	dbpv.setConfig('lookupgraph', "http://dbpedia.org");
	dbpv.setConfig('lookupendpoint', "http://lookup.dbpedia.org/api/search");

	dbpv.setConfig('primarylang', "en");
	dbpv.setConfig('fallbacklang', "en");	
	
	dbpv.setConfig('labelPrefs' ,[
		"http://www.w3.org/2000/01/rdf-schema#label"
	]);
	
	dbpv.setConfig('showLabels' , true);
	
	dbpv.setConfig('templateStr', "Template");//*/
};