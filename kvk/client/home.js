Template.Home.helpers({	
	inititiatives: function(){
		var beersQuery = filteredInitiativesQuery(Session.get("kvkData"));
		var query = beersQuery;

		if(Session.get("search")) {
			var r = new RegExp(".*"+Session.get("search")+".*", "i")
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
            $addToSet: {"votedUsers": thisUserId}
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
    },
    "submit form": function (evt) {
        var descr = $(evt.target).find(".input-description");
        var userId = 0;
        Initiatives.update({_id: this._id}, {
            $addToSet: {"commentData": {"userId":userId, "date" : new Date(), "content" : descr.val()}}
        }, false);

        descr.val("");

        Session.set("compose-open", false);
        return false;
    }
})

Template.Home.events({
    "submit form": function (evt) {
        var title = $(evt.target).find(".input-title")
        var descr = $(evt.target).find(".input-description")
        var branch = $(evt.target).find(".input-branch")
        var radius = $(evt.target).find(".input-radius")
        var target = $(evt.target).find(".input-target")

        kvkData = Session.get("kvkData");

        Initiatives.insert({
            title: title.val(),
            description: descr.val(),
            date: new Date(),
            radius: radius.val(),
            branch: branch.val(),
            location: {type: "Point", coordinates: [kvkData.gpsLongitude, kvkData.gpsLatitude]},
            //location: {type: "Point", coordinates: [6.117563, 50.774050]}, //8km van kvkData met id=1
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
    }
})