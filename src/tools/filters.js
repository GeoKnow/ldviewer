var filterModule = angular.module('ldv.filters', []);

filterModule.filter("valueFilter", function() {
	return function(input, query) {
		if (!query) {
			//console.log("valueFilter value: "+ query);
			//return input;
			//query = angular.element($("body")).scope().valfilter;
			//console.log("valueFilter value: "+ query);
		}
		if (!query) {
			return input;
		} else {
			query = query.toLowerCase();
			var result = [];
			//result.push(input[0]);
			angular.forEach(input, function(value) {
				var label = value.lex;
				if (label === undefined && value.literalLabel !== undefined) {
					label = value.literalLabel.lex;
				}
				/*if (value.labelNodes !== undefined) {
					label = [];
					for (var i = 0; i < value.labelNodes.length; i++) {
						label.push(value.labelNodes[i].literalLabel.val);
					}
				}//*/
				/*if (label !== undefined && label instanceof Array && label.length !== undefined && label.length > 0) {
					var contained = false;
					for (var i = 0; i < label.length; i++) {
						if (label[i].toLowerCase().indexOf(query) != -1) {
							contained = true;
							break;
						}
					}
					if (contained)
						result.push(value);
				} else //*/if (label !== undefined && label.toLowerCase().indexOf(query) != -1) 
					result.push(value);
			});
			return result;
		}
	};
});

filterModule.filter("predicateFilter", function() {
	return function(input, query) {
		if(!query) return input;
		query = query.toLowerCase();
		var result = {};
		angular.forEach(input, function(predicate) {
			var label = predicate.lex.toLowerCase();
			if (label.indexOf(query) != -1) {
				result[predicate.predid]=predicate;
			} /*else if (predicate.uri.toLowerCase().indexOf(query) != -1) {
				result.push(predicate);
			}*/
		});
		return result;
	};
});

filterModule.filter("predicateValueFilter", function() { //XXX maybe merge with previous filter
	return function(input, query) {
		if (!query) {
			return input;
		}
		query = query.toLowerCase();
		var result = {};
		angular.forEach(input, function(predicate) {
			var hasvalues = false;
			for (var i = 0; i<predicate.values.length; i++) {	//simulates value filter
				var label = predicate.values[i].lex;
				if (label === undefined && predicate.values[i].literalLabel !== undefined) {
					label = predicate.values[i].literalLabel.lex;
				}
				if (label !== undefined && label.toLowerCase().indexOf(query) != -1) {
					hasvalues = true;
				}//*/
				
				
				
			}
			if (hasvalues) {
				result[predicate.predid] = predicate;
			}
		});
		return result;
	};
});

filterModule.filter("languageFilter", function() {
	return function(input, primary, fallback) {
		if(input && (!primary || !fallback || input.length<2)) {
			//console.log("primary: "+primary+", fallback"+fallback);
			// TODO dirty hack
			//primary = angular.element($("body")).scope().primarylang;
			//fallback = angular.element($("body")).scope().fallbacklang;
			//return input;
		}//else{
		if	(input === undefined || input.length<2) {
			return input;
		} else {
			var result = [];
			//result.push(input[0]);
			var breek = false;
			var primarylanga = false;
			angular.forEach(input, function(predval) {
				if (!breek){
					if (predval.uri !== undefined) {
						result.push(predval);
					} else if (predval.literalLabel !== undefined) {
						if (predval.literalLabel.lang == "en") {
							//alert(JSON.stringify(predval) + "\n\n" + fallback);
						}
						if (predval.literalLabel.lang === undefined || predval.literalLabel.lang == "") {
							result.push(predval);
						} else {
							if (predval.literalLabel.lang == primary) {
								if (!primarylanga) {
									for (var i = 0; i<result.length; i++) {
										var res = result[i];
										if (res.literalLabel !== undefined && res.literalLabel.lang !== undefined && res.literalLabel.lang != primary) {
											result.splice(i, 1);
											i--;
										}
									}
								}
								result.push(predval);
								primarylanga = true;
								//console.log(JSON.stringify(predval) + " :: "+primary+" : "+fallback+" : "+predval.literalLabel.lang);
								//breek = true;
							}else if (result.length == 0 && predval.literalLabel.lang == fallback && !primarylanga) {
								result.push(predval);
								//console.log(fallback+" : "+predval.literalLabel.lang);
							} else {
								//console.log(primary+" : "+fallback+" : "+predval.literalLabel.lang);
							}
						}
					}
				}
			});
			return result;
		};
	};
});

filterModule.filter("actionFilter", function() {
	return function(actions, about, pred, val) {
		if(!pred || !val) return [];
		var result = [];
		angular.forEach(actions, function(action) {
			if (action.autobind !== undefined && action.autobind(about, pred, val)) {
				result.push(action);
			}
		});
		return result;
	};
});