Template.Home.helpers({
	
	inititiatives: function(){
		var query = {}
				
		if(Session.get("search")) {
			var r = new RegExp(".*"+Session.get("search")+".*", "i")
			query["$or"] = [
				{"title": r},
				{"description": r},
				{"branch": r},
			];		
		}

		var beersQuery = filteredInitiativesQuery(Session.get("kvkData"));

		outer = { $and: [query, beersQuery] }

		return Initiatives.find(outer, { sort: { date: -1 } });
	},
	
	composeOpen: function(){
		return Session.get("compose-open");
	}
	
})

Template.Initiative.helpers({
    calculatePercentage: function () {
        if (!this.votedUsers)
            return 0;
        console.log(this.votedUsers);
        if (this.votedUsers.length == 0)
            return 0;
        else if (this.votedUsers.length > this.target)
            return 100;
        else
            return this.target / this.votedUsers.length
    },
    composeOpen: function () {
        return Session.get("compose-comment-open");
    }
})

Template.Initiative.events({
    "click #endorseButton": function (evt) {
        thisUserId = 1;
        Initiatives.update({_id: this._id}, {
            $addToSet: {"votedUsers": [thisUserId]}
        }, false);
    },
    "mouseenter .mdi-content-add": function (evt) {
        $(evt.target).removeClass("mdi-content-add").addClass("mdi-content-create");
    },
    "mouseleave .mdi-content-create": function (evt) {
        $(evt.target).removeClass("mdi-content-create").addClass("mdi-content-add");
    },
    "click .compose > a": function (evt) {
    Session.set("compose-comment-open", !Session.get("compose-comment-open"));
}
})

Template.Home.events({
    "submit form": function (evt) {
        var title = $(evt.target).find(".input-title")
        var descr = $(evt.target).find(".input-description")
        var branch = $(evt.target).find(".input-branch")
        var radius = $(evt.target).find(".input-radius")
        var target = $(evt.target).find(".input-target")

        Initiatives.insert({
            title: title.val(),
            description: descr.val(),
            date: new Date(),
            radius: radius.val(),
            branch: branch.val(),
            votes: 0,
            comments: 0,
            target: target.val()
        })

        title.val("")
        descr.val("")
        branch.val("")
        radius.val("")
        target.val("")

        Session.set("compose-open", false);
        return false;
    },
    "reset form": function () {
        Session.set("compose-open", false);
    },
    "mouseenter .mdi-content-add": function (evt) {
        $(evt.target).removeClass("mdi-content-add").addClass("mdi-content-create");
    },
    "mouseleave .mdi-content-create": function (evt) {
        $(evt.target).removeClass("mdi-content-create").addClass("mdi-content-add");
    },
    "click .compose > a": function (evt) {
        Session.set("compose-open", !Session.get("compose-open"));
    },
	
	
		"click #input-header": function(evt){
		console.log("Adding to",evt.target)
					if($(evt.target).find("input").size() == 0) {
				$("<input />").addClass("transparent").appendTo($(evt.target).text(""));
			}
		},
		
		"keyup #input-header input": function(evt){
			Meteor.call("search", $(evt.target).val(), function(){
				console.log("Search", arguments);
			});
		}
})