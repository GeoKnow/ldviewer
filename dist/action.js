(function() {

var YourAction = Class.create(Taf.ActionFactory, {
		check:	function(about, predicate, value) {
			// PUT THE CHECK LOGIC HERE (whether your action is applicable to the triple)
			// 		use predicate.forward to determine whether the triple defined by <about, predicate, value> is forward (<about, predicate, value>) or reverse (<value, predicate, about>)
			return true;
			
			
			/* SAMPLE IMPLEMENTATION
			if (value.uri === undefined || (value.uri.indexOf("http://dbpedia.org/resource") != 0)) {
				return false;
			} else {
				return true;
			}
			*/
		},
		
		legend: {
			// PUT YOUR LEGEND DEFINITION HERE
			name:	"",
			description:	"",
			lines:	[
				{
					icon:"",
					text:""
				}
			]
		
		/* SAMPLE IMPLEMENTATION:
			name:	"Wikipedia",
			description:	"Show original Wikipedia page",
			lines:	[
						{
							icon:	"<span class='dbpvicon dbpvicon-wikipedia'></span>",
							text:	"Opens the corresponding Wikipedia page"
						}
					]
		*/
		},
		
		action:	Class.create(Taf.Action, {
			// PUT YOUR ACTION INSTANCE DEFINITION HERE:
			description:	"",
			display:		function() {
				return "<span class='glyphicon glyphicon-share'></span>";
			},
			execute:		function(about, predicate, value) {
				//PUT YOUR EXECUTION LOGIC HERE

			}
			
			
			/* SAMPLE IMPLEMENTATION
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
			*/
		})
	});
	
	Taf.addAction(YourAction);

})();