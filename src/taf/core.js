LDViewer.taf = {};

LDViewer.taf.ActionFactory = Class.create({
	check:	function(about, predicate, value) {
	
	},
	/*legend:	{
		name:			"",
		description:	"",
		lines:			[{}]
	},//*/
	action:	LDViewer.taf.Action,
	factory:	function(about, predicate, value) {
		var instance = new this.action(about, predicate, value);
		if (instance.description === undefined && this.legend && this.legend.description) {
			instance.description = this.legend.description;
		}
		return instance;
	}
});

LDViewer.taf.Action = Class.create({
		initialize:	function(about, predicate, value) {
			/*this.about = about;
			this.predicate = predicate;
			this.value = value;//*/
		},
		//display:	function() {},
		//description:	function() {},
		execute:	function() {}
	})
;

LDViewer.taf.ActionGroupFactory = Class.create(LDViewer.taf.ActionFactory, {
	group:	[],
	action:	Class.create(LDViewer.taf.Action, {
	}),
	factory:	function(about, predicate, value) {
		var instance = new this.action(about, predicate, value);
		instance.actions = [];
		for (var i = 0; i < this.group.length; i++) {
			var memberInstance = new this.group[i](about,predicate,value);
			if (memberInstance.check(about, predicate, value)) {
				instance.actions.push(memberInstance.factory(about, predicate, value));
			}
		}
		return instance;
	}
});

LDViewer.taf.ActionGroup = Class.create(LDViewer.taf.Action, {
	actions:	[]
});

var Taf = LDViewer.taf;

Taf.actions = [];
Taf.addAction = function(action) {
	if (action) {
		Taf.actions.push(new action());
	}
}

////////////////////////////////////////////////////////////////////
