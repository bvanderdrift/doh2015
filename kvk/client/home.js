Template.Home.helpers({
	
	inititiatives: function(){
		var query = {}
				
		if(Session.get("search")) {
			var r = new RegExp(".*"+Session.get("search")+".*")
			query["$or"] = [
				{"title": r},
				{"description": r},
				{"branch": r},
			];		
		}

		return Initiatives.find(query, { sort: { date: -1 } });
	},
	
	composeOpen: function(){
		return Session.get("compose-open");
	}
	
})

Template.Home.events({
	"submit form": function(evt){
		var title  = $(evt.target).find(".input-title")
		var descr  = $(evt.target).find(".input-description")
		var branch = $(evt.target).find(".input-branch")
		var radius = $(evt.target).find(".input-radius")

		Initiatives.insert({
			title: title.val(),
			description: descr.val(),
			date: new Date(),
			radius: radius.val(),
			branch: branch.val(),
			votes: 0,
			comments: 0
		})
		title.val("")
		descr.val("")
		return false;
	},
	"reset form": function(){
		Session.set("compose-open", false);
	},
	"mouseenter .mdi-content-add": function(evt){
		$(evt.target).removeClass("mdi-content-add").addClass("mdi-content-create");
	},
	"mouseleave .mdi-content-create": function(evt){
		$(evt.target).removeClass("mdi-content-create").addClass("mdi-content-add");
	},
	"click .compose > a": function(evt){
		Session.set("compose-open", !Session.get("compose-open"));
	}
})