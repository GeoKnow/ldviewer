
angular.module('ldv.services.taf', [])
	.factory('TafService', ['$rootScope', function($rootScope) {
		return {
			onPredicateChange:		function(about, predicates) {
				if (predicates !== undefined) {
					this.bindTaf(about, predicates);
					for (var id in predicates) {
						for (var i = 0; i<predicates[id].values.length; i++) {
							if (predicates[id].forward) {
								var val = predicates[id].values[i];
								if (val.literalLabel !== undefined && val.literalLabel.lang!== undefined && val.literalLabel.lang !== "") {
									LDViewer.newAvailableLanguage(val.literalLabel.lang);
								}
							}
						}
					}
				}
			},
			
			bindTaf:				function(about, predicates) {
				var actions = this.getActions();
				for (var key in predicates) {
					var predicate = predicates[key];
					this.bindTafPredicate(about, predicate, actions);
				}
			},
			
			bindTafPredicate:		function(about, predicate, actions) {
				if (!actions) actions = this.getActions();
				for(var j = 0; j < predicate.values.length; j++) {
					var val = predicate.values[j];
					if (val.taf === undefined) {
						val.taf = [];
						for (var k = 0; k < actions.length; k++) {
							var subk = actions[k];
							try {
								var actionInstance = new subk(about, predicate, val);
								val.taf.push(actionInstance);
							} catch (err) {
								//console.log(err);
							}
						}
					}
				}
			},
			
			getActions:				function() {
				console.log("getting actions");
				var actions = [LDViewer.Action];
				var i = 0;
				while (i < actions.length) {
					var action = actions[i];
					if (action.abstrait) {
						actions.splice(i, 1);
						i--;
					}
					for (var id in action.subclasses) {
						var act = action.subclasses[id];
						actions.push(act);
					}
					i++;
				}
				return actions;
			}
			
		};
	}])
;