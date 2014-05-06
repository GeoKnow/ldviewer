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
