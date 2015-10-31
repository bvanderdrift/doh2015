Template.Home.helpers({
	
	inititiatives: function(){
		return Initiatives.find({}, { sort: { date: -1 } });
	},
	
	composeOpen: function(){
		return Session.get("compose-open");
	}
	
})

Template.Home.events({
	"submit form": function(evt){
		var title = $(evt.target).find(".input-title")
		var descr = $(evt.target).find(".input-description")
		Initiatives.insert({
			title: title.val(),
			description: descr.val(),
			date: new Date(),
		})
		title.val("")
		descr.val("")
		return false;
	},
	"reset form": function(){
		
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