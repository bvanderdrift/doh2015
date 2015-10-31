Template.Home.helpers({
	
	inititiatives: function(){
		return Initiatives.find({}, { sort: { date: -1 } });
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
		
	}
})