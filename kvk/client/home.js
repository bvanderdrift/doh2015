Template.Home.helpers({
	
	inititiatives: function(){
		return Initiatives.find({}, { sort: { date: -1 } });
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
		
	}
})