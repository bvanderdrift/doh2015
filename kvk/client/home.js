Template.Home.helpers({
	
	inititiatives: function(){
		return Initiatives.find({});
	}
	
})

Template.Home.events({
	"submit form": function(evt){
		var title = $(evt.target).find(".input-title")
		var descr = $(evt.target).find(".input-description")
		Initiatives.insert({
			title: title.val(),
			description: descr.val()
		})
		title.val("")
		descr.val("")
		return false;
	},
	"reset form": function(){
		
	}
})