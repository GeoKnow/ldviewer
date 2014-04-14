dbpv.Action = Class.create({
	initialize:	function (about, predicate, value) {
		if (about === undefined || predicate === undefined || value === undefined) {
			throw "action not applicable";
		}
		this.about = about;
		this.predicate = predicate;
		this.value = value;
	}
});

dbpv.Action.init = function() {

};

dbpv.Action.abstrait = true;

///////////////////////////////////////////////////////////////
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//

var RedirectAction = Class.create(dbpv.Action, {
	initialize:	function(about, predicate, value) {
		if (predicate.forward && predicate.uri == "http://dbpedia.org/ontology/wikiPageRedirects") {
			window.location = dbpv.preprocess_triple_url(value.uri);
		}
		throw "done";
	}
});

var PrettyListAction = Class.create(dbpv.Action, {
	initialize:	function(about, predicate, value) {
		if (predicate.forward) {
			if (predicate.uri == "http://dbpedia.org/ontology/birthPlace") {
				dbpv.addToPrettyList("Place of Birth", value);
			}
			else if (predicate.uri == "http://dbpedia.org/property/occupation") {
				dbpv.addToPrettyList("Occupation", value);
			}
			else if (predicate.uri == "http://dbpedia.org/ontology/birthDate") {
				dbpv.addToPrettyList("Date of Birth", value);
			}
		}
	}
	
	
});

var PrettyBoxAction = Class.create(dbpv.Action, {
	initialize:	function(about, predicate, value, mapfrom, mapto) {
		if (predicate.uri == mapfrom) {
			dbpv.applyPrettyBox(function(dbpvp) {
				if (dbpvp[mapto] === undefined) dbpvp[mapto] = [];
				dbpvp[mapto].push(value);
			});
		}
		throw "done";		
	}
});
PrettyBoxAction.abstrait = true;

var LabelAction = Class.create(PrettyBoxAction, {
	initialize:	function($super, about, predicate, value) {
		$super(about, predicate, value, this.mapfrom, this.mapto);
	},
	
	mapfrom:	"http://www.w3.org/2000/01/rdf-schema#label",
	mapto:		"label"
});

var TypeAction = Class.create(PrettyBoxAction, {
	initialize:	function(about, predicate, value) {
		if (predicate.uri == this.mapfrom && value.uri.slice(0, this.prefiks.length)==this.prefiks) {
			var mapto = this.mapto;
			var mapfrom = this.mapfrom;
			value.displayValue = value.uri.slice(this.prefiks.length, value.uri.length);
			//console.log(JSON.stringify(value.uri.slice(this.prefiks.length, value.uri.length)));
			dbpv.applyPrettyBox(function(dbpvp) {
				if (dbpvp[mapto] === undefined) dbpvp[mapto] = [];
				dbpvp[mapto].push(value);
				//console.log(JSON.stringify(value));
			});
		}
		throw "done";
	},
	
	//prefiks:	"http://linkedgeodata.org/ontology/",
	prefiks:	"http://dbpedia.org/ontology/",
	mapfrom:	"http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
	mapto:		"types"
});

var AbstractAction = Class.create(PrettyBoxAction, {
	initialize:	function($super, about, predicate, value) {
		$super(about, predicate, value, this.mapfrom, this.mapto);
	},
	
	mapfrom:	"http://www.w3.org/2000/01/rdf-schema#comment",
	//mapfrom:	"http://dbpedia.org/ontology/abstract",
	mapto:		"description"
});

var ThumbnailAction = Class.create(PrettyBoxAction, {
	initialize:	function($super, about, predicate, value) {
		$super(about, predicate, value, this.mapfrom, this.mapto);
	},
	
	mapfrom:	"http://dbpedia.org/ontology/thumbnail",
	mapto:		"thumbnail"
});

var LinkAction = Class.create(PrettyBoxAction, {
	initialize: function(about, predicate, value) {
		if (predicate.forward) {
			for (var i = 0; i < this.mappings.length; i++) {
				var mapping = this.mappings[i];
				if (mapping.predex.test(predicate.uri) && mapping.valuex.test(value.uri)) {
					var mapto = this.mapto;
					var label = mapping.label;
					var matches = mapping.labelx.exec(value.uri);
					matches = matches.slice(1);
					value.plex = matches.join("");
					dbpv.applyPrettyBox(function(dbpvp) {
						if (dbpvp[mapto] === undefined) dbpvp[mapto] = {};
						if (dbpvp[mapto][label] === undefined) dbpvp[mapto][label] = [];
						dbpvp[mapto][label].push(value);
					});
				}
			}
		}
		throw "done";
	},
	
	mapto:		"links",
	
	mappings:	[
				{
				"predex": new RegExp("^http\:\/\/xmlns.com\/foaf\/0\.1\/isPrimaryTopicOf$"), 
				"valuex": new RegExp(".*wikipedia.*"), 
				"label": "wikipedia",
				"labelx": new RegExp("http\:\/\/([a-z]+\.wikipedia\.org\/.+)")
				},
				{
				"predex": new RegExp("^http\:\/\/www\.w3\.org\/2002\/07\/owl\#sameAs$"), 
				"valuex": new RegExp(".*dbpedia\.org.*"), 
				"label": "dbpedia",
				"labelx": new RegExp("http\:\/\/([a-z]+\.dbpedia)\.org\/resource(\/.+)")
				},
				{
				"predex": new RegExp("^http\:\/\/www\.w3\.org\/2002\/07\/owl\#sameAs$"), 
				"valuex": new RegExp(".*freebase\.com.*"), 
				"label": "freebase",
				"labelx": new RegExp("^http\:\/\/(.+)$")
				}
				]
});

var MapAction = Class.create(PrettyBoxAction, {
	initialize:	function(about, predicate, value) {
		if (predicate.forward && predicate.uri == this.mapfrom) {
			var matches = value.literalLabel.val.match(/([-+]?([0-9]*\.[0-9]+|[0-9]+))\s([-+]?([0-9]*\.[0-9]+|[0-9]+))/);
			var coord = [matches[3], matches[1]];
			dbpv.setMapCoord(coord);
		}
		throw "done";
	},
	
	mapfrom:	"http://www.georss.org/georss/point"
});

var LgdMapAction = Class.create(dbpv.Action, {
	initialize:	function(about, predicate, value) {
		if (predicate.forward && predicate.uri == this.mapfrom) {
			var matches = value.literalLabel.lex.match(this.regex);
			var coord = [matches[1], matches[3]];
			dbpv.setMapCoord(coord);
		}
		throw "done";
	},
	
	mapfrom:	"http://www.opengis.net/ont/geosparql#asWKT",
	
	regex:		/POINT\(([-+]?([0-9]*\.[0-9]+|[0-9]+))\s([-+]?([0-9]*\.[0-9]+|[0-9]+))\)/
});

var LgdDuoMapAction = Class.create(dbpv.Action, {
	initialize:	function(about, predicate, value) {
		if (predicate.forward && predicate.uri == this.latprop) {
			LgdDuoMapAction.currentLat = value.literalLabel.lex;
		} else if (predicate.forward && predicate.uri == this.lonprop) {
			LgdDuoMapAction.currentLon = value.literalLabel.lex;
		}
		
		if (LgdDuoMapAction.currentLon !== undefined && LgdDuoMapAction.currentLat !== undefined) {
			dbpv.setMapCoord([LgdDuoMapAction.currentLon, LgdDuoMapAction.currentLat]);
			LgdDuoMapAction.currentLon = undefined;
			LgdDuoMapAction.currentLat = undefined;
		}
		
		throw "done";
	},
	
	latprop:	"http://www.w3.org/2003/01/geo/wgs84_pos#lat",
	lonprop:	"http://www.w3.org/2003/01/geo/wgs84_pos#long"
});

var ShortcutAction = Class.create(PrettyBoxAction, {
	initialize:	function(about, predicate, value) {
		for (var url in this.mappings) {
			if (predicate.uri == url && predicate.forward != this.mappings[url].reverse) {
				var map = this.mappings[predicate.uri].label;
				var prio = this.mappings[predicate.uri].prio;
				dbpv.addShortcut(predicate.uri, map, prio);
			}
		}
		throw "done";
	},
	
	mappings:	{
			"http://www.w3.org/1999/02/22-rdf-syntax-ns#type":{
				"reverse": false,
				"label": "TYPES",
				"prio": 10
			},
			"http://purl.org/dc/terms/subject":{
				"reverse": false,
				"label": "CATEGORIES",
				"prio": 11
			},
			"http://dbpedia.org/ontology/birthPlace":{
				"reverse": true,
				"label": "Born Here",
				"prio": 1
			},
			"http://dbpedia.org/ontology/wikiPageExternalLink":{
				"reverse":false,
				"label": "External Links",
				"prio": 9
			},
			"http://dbpedia.org/ontology/starring": {
				"reverse":true,
				"label": "Starred in",
				"prio": 1
			},
			"http://www.w3.org/2002/07/owl#sameAs": {
				"reverse":false,
				"label": "Same As",
				"prio": 8
			}
		}
});
//*/

var WikipediaAction = Class.create(dbpv.Action, {
	initialize:	function(about, predicate, value) {
		if (value.uri === undefined || (value.uri.indexOf("http://dbpedia.org/resource") != 0)) {
			throw "not applicable";
		}
	},
	
	description:	"View original Wikipedia page",
	
	display:		function () {
		return "<span class='dbpvicon dbpvicon-wikipedia'></span>";
	},
	
	regex:			/http\:\/\/(\w{2,3}\.)?dbpedia\.org\/resource\/(.+)/g,
	
	execute:		function (about, predicate, value) {
		var match = this.regex.exec(value.uri);
		if (match[1] === undefined) match[1] = "";
		var wikilink = "http://"+match[1]+"wikipedia.org/wiki/"+match[2];
		window.open(wikilink);
	}
});

WikipediaAction.legendize = function() {
	return {
		name:	"Wikipedia",
		description:	"Show original Wikipedia page",
		lines:	[
					{
						icon:	"<span class='dbpvicon dbpvicon-wikipedia'></span>",
						text:	"Opens the corresponding Wikipedia page"
					}
				]
	};
};

var TemplateAction = Class.create(dbpv.Action, {
	initialize:	function(about, predicate, value) {
		var regex = new RegExp(this.regex());
		if (value.uri === undefined || !regex.test(value.uri)) {
			throw new "not applicable";
		}
	},
	
	description:	"View DBpedia mapping",
	
	display:	function() {
		return "<span class='glyphicon glyphicon-forward'></span>";
	},
	
	execute:	function(about, predicate, value) {
		var regex = new RegExp(this.regex());
		var match = regex.exec(value.uri);
		if (match[2] === undefined) match[2] = "en.";
		var maplink = "http://mappings.dbpedia.org/index.php/Mapping_"+match[2].substring(0, match[2].length-1)+":"+match[3];
		window.open(maplink);
	}
});
//*/

var RelFinderAction = Class.create(dbpv.Action, {
	initialize:		function(about, predicate, value) {
		var checkregex = new RegExp("^http\:\/\/([a-z]+\.)?dbpedia\.org\/resource\/.+$");
		if (value.uri === undefined || (checkregex.exec(value.uri)[1] != checkregex.exec(about.uri)[1])) {
			throw new "not applicable";
		}
	},
	description:	"View more relations on RelFinder",
	display:		function() {
		return "<span class='dbpvicon dbpvicon-relfinder'></span>";
	},
	execute:		function(about, predicate, value) {
		var neregex = new RegExp("^http\:\/\/([a-z]+\.)?dbpedia\.org\/resource\/(.+)$");
		var nameA = encodeURIComponent(neregex.exec(about.uri)[2]);
		var lang = neregex.exec(about.uri)[1];
		if (lang === undefined) {
			lang = "";
		}
		var nameB = encodeURIComponent(neregex.exec(value.uri)[2]);
		var urlA = about.uri;
		var urlB = value.uri;
		if (predicate.reverse) {
			var nameC = nameA;
			nameA = nameB;
			nameB = nameC;
			nameC = urlA;
			urlA = urlB;
			urlB = nameC;
		}
		var pieces = [];
		pieces.push("http://www.visualdataweb.org/relfinder/demo.swf");
		pieces.push("?");
		pieces.push("obj1="+this.to64(nameB+"|"+urlB));
		pieces.push("&obj2="+this.to64(nameA+"|"+urlA));

		pieces.push("&name="+this.to64("DBpedia"));
		pieces.push("&abbreviation="+this.to64("dbp"));
		pieces.push("&description="+this.to64("Linked Data version of Wikipedia"));
		pieces.push("&endpointURI="+this.to64("http://"+lang+"dbpedia.org/sparql")) //XXX XXX
		pieces.push("&dontAppendSPARQL="+this.to64("true"));
		pieces.push("&defaultGraphURI="+this.to64("http://"+lang+"dbpedia.org"));
		pieces.push("&isVirtuoso="+this.to64("true"));
		pieces.push("&useProxy=ZmFsc2U=&method=UE9TVA==&autocompleteLanguage=ZW4=&autocompleteURIs=aHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVs&ignoredProperties=aHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zI3R5cGUsaHR0cDovL3d3dy53My5vcmcvMjAwNC8wMi9za29zL2NvcmUjc3ViamVjdCxodHRwOi8vZGJwZWRpYS5vcmcvcHJvcGVydHkvd2lraVBhZ2VVc2VzVGVtcGxhdGUsaHR0cDovL2RicGVkaWEub3JnL3Byb3BlcnR5L3dvcmRuZXRfdHlwZSxodHRwOi8vZGJwZWRpYS5vcmcvcHJvcGVydHkvd2lraWxpbmssaHR0cDovL3d3dy53My5vcmcvMjAwMi8wNy9vd2wjc2FtZUFzLGh0dHA6Ly9wdXJsLm9yZy9kYy90ZXJtcy9zdWJqZWN0&abstractURIs=aHR0cDovL2RicGVkaWEub3JnL29udG9sb2d5L2Fic3RyYWN0&imageURIs=aHR0cDovL2RicGVkaWEub3JnL29udG9sb2d5L3RodW1ibmFpbCxodHRwOi8veG1sbnMuY29tL2ZvYWYvMC4xL2RlcGljdGlvbg==&linkURIs=aHR0cDovL3B1cmwub3JnL29udG9sb2d5L21vL3dpa2lwZWRpYSxodHRwOi8veG1sbnMuY29tL2ZvYWYvMC4xL2hvbWVwYWdlLGh0dHA6Ly94bWxucy5jb20vZm9hZi8wLjEvcGFnZQ==&maxRelationLegth=Mg==");
		window.open(pieces.join(""));
	},
	to64:			function(input) {
		var keyStr = "ABCDEFGHIJKLMNOP" +
	               "QRSTUVWXYZabcdef" +
	               "ghijklmnopqrstuv" +
	               "wxyz0123456789+/" +
	               "=";
		//input = escape(input);
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		 
		do {
			chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
		 
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
		 
				if (isNaN(chr2)) {
				enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
				enc4 = 64;
				}
		 
				output = output +
				keyStr.charAt(enc1) +
				keyStr.charAt(enc2) +
				keyStr.charAt(enc3) +
				keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
			 } while (i < input.length);
		 
		return output;
	}
});
//*/
//XXX DOESN'T WORK
var SpotlightAction = Class.create(dbpv.Action, {
	initialize:		function(about, predicate, value) {
		if (value.literalLabel === undefined || value.literalLabel.lex === undefined || value.literalLabel.lex.length < 50) {
			throw new "not applicable";
		}
	},
	
	busy:	false,
	done:	false,
	
	display:	function() {
		if (this.busy) {
			return "<span class='glyphicon glyphicon-time'></span>";
		}else{
			return "<span class='glyphicon glyphicon-bullhorn'></span>";
		}
	},
	
	value:	undefined,
	
	endpoint:	"http://spotlight.dbpedia.org/rest/annotate",
	
	execute:	function(about, predicate, value) {
		if (!this.busy && !this.done) {
			//this.value = value.literalLabel.lex;
			//this.annotate_async(value.literalLabel.lex, this.execute_callback, this);
			var busy = this;
			var text = value.literalLabel.lex;
			dbpv.http.get(this.endpoint+"?text="+encodeURIComponent(text)).success(function (data, status, headers, config) {	
				busy.busy = false;
				busy.done = true;
				if (data !== undefined && data["Resources"] !== undefined) {
					var annotations = data["Resources"];
					var previndex = 0;
					var pieces = [];
					for (var i = 0; i<annotations.length; i++) {
						var annotation = annotations[i];
						var offset = parseInt(annotation["@offset"]);
						var len = annotation["@surfaceForm"].length;
						var link = annotation["@URI"];
						link = dbpv.preprocess_triple_url(link);
						link = '<a dbpv-preview href="'+link+'">';
						pieces.push(text.substring(previndex, offset));
						pieces.push(link+text.substr(offset, len)+"</a>");
						previndex = offset+len;
					}
					pieces.push(text.substr(previndex));
					value.literalLabel.lex = pieces.join("");
					//dbpv.compile(value.literalLabel.lex);
				}
			})
			.error(function (data, status, headers, config) {
				dbpv.addNotification("Annotation request failed",5000);
				//callback(undefined);
			});
			this.busy = true;
		} else {
			dbpv.addNotification("Annotation request to the DBpedia Spotlight API is already pending", 5000);
		}
	}
});
//*/

var LodliveAction = Class.create(dbpv.Action, {
	initialize:		function(about, predicate, value) {
						if (value.uri === undefined || (value.uri.indexOf("http://dbpedia.org/resource") != 0)) {
							throw new "not applicable";
						}
					},
					
	display:		function() {
						return "<span class='dbpvicon dbpvicon-lodlive'></span>";
					},
	
	description:	"View in LodLive",
	
	execute:		function(about, predicate, value) {
						var lodurl = "http://en.lodlive.it/?";
						window.open(lodurl+value.uri);
					}
});

var DisclaimerAction = Class.create(dbpv.Action, {
	initialize:		function(about, predicate, value) {
						if (predicate.uri.match("http://xmlns.com/foaf/0.1/isPrimaryTopicOf")) {
							//alert("disclaimer action called");
							var settings = {};
							settings.url = value.uri;
							var regex = new RegExp("http:\\/\\/(\\w{2,4})\\.wikipedia\\.org\\/wiki\\/(.*)");
							var match = regex.exec(value.uri);
							var lang = match[1];
							settings.title = match[2];
							settings.history = "http://" + lang + ".wikipedia.org/w/index.php?title=" + settings.title + "&action=history";
							dbpv.setFooterWikipage(settings);
						}
						throw "executed";
					}
});

var NofollowAction = Class.create(dbpv.Action, {
	initialize:		function(about, predicate, value) {
						if (predicate.uri.match("wikiPageExternalLink") || predicate.uri.match("xmlns.com/foaf/0.1/homepage")) {
							value.nofollow = true;
						}
						throw "executed";
					}
});

var RelationInstancesAction = Class.create(dbpv.Action, {
	initialize:		function(about, predicate, value) {
						if (predicate.uri.match("http://www.w3.org/1999/02/22-rdf-syntax-ns#type") && (value.uri.match("#DatatypeProperty") || value.uri.match("#ObjectProperty") || value.uri.match("http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"))) {
							dbpv.showRelationInstances();
						}
						throw "executed";
					}
});

var ClassInstancesAction = Class.create(dbpv.Action, {
	initialize:		function(about, predicate, value) {
						if (predicate.uri.match("http://www.w3.org/1999/02/22-rdf-syntax-ns#type") && value.uri.match("#Class")) {
							dbpv.showClassInstances();
						}
						throw "executed";
					}
});