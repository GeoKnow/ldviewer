LDViewer.configuration = function() {
	var config = {
		"previewMappings": {
			label:		"http://www.w3.org/2000/01/rdf-schema#label",
			thumbnail:	"http://dbpedia.org/ontology/thumbnail",
			description:"http://www.w3.org/2000/01/rdf-schema#comment",
			properties:	{
				Domain:	"http://www.w3.org/2000/01/rdf-schema#domain",
				Range:	"http://www.w3.org/2000/01/rdf-schema#range",
				Superclass:	"http://www.w3.org/2000/01/rdf-schema#subClassOf"
			}
		},
		"prefixes":			{
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
		},
		
		'entitySemaphore': 0,

		'localprefix': "#",
		
		'godmode': false,
		
		'localgraph': "http://dbpedia.org",
		'endpointgraph': [],
		
		'endpoint': "http://dbpedia.org/sparql",
		'encodegraph': true,

		'owlgraph': "http://dbpedia.org",
		'owlendpoint': "http://dbpedia.org/sparql",
		
		'lookupgraph': "http://dbpedia.org",
		'lookupendpoint': "http://lookup.dbpedia.org/api/search",

		'primarylang': "en",
		'fallbacklang': "en",
		
		'labelPrefs': [
			"http://www.w3.org/2000/01/rdf-schema#label"
		],
		
		'showLabels': true,
		
		'templateStr': "Template",
		'iconpath': "dist/img/200px-dbpedia.png"
		
	};
	for (var key in config) {
		LDViewer.setConfig(key, config[key]);
	}
};
