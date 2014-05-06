LDViewer.Action = Class.create({
	initialize:	function (about, predicate, value) {
		if (about === undefined || predicate === undefined || value === undefined) {
			throw "action not applicable";
		}
		this.about = about;
		this.predicate = predicate;
		this.value = value;
	}
});

LDViewer.Action.init = function() {

};

LDViewer.Action.abstrait = true;
