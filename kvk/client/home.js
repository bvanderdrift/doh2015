initiativeChange = new Deps.Dependency;

Meteor.call("getBsiData", function(err, response){
    Session.set("bsiData", response);
});

Meteor.startup(function(){
	Deps.autorun(function(){
		Initiatives.find({}, { sort: { date: -1 } })
		initiativeChange.changed();
	})	
})

getInitiatives = function() {
        if(!Session.get("kvkData")) return;

        var query = {};

        if(Session.get("search")) {
            var r = new RegExp(".*"+Session.get("search")+".*", "i")
            query["$or"] = [
                {"title": r},
                {"description": r},
                {"branch": r},
            ];      
        }

				initiativeChange.depend();
        return Initiatives.find(query, { sort: { votes: -1 } }).fetch().filter(i => InitiativePredicate(Session.get("kvkData"), i))
    }

Template.Home.onCreated(function() {
    if(Session.get("kvkData")) return;
    
    var startKvkNr = "14053909";
        Session.set('kvkNr', startKvkNr);
        reloadKvkData(startKvkNr);
})

Template.Home.helpers({	
    businessName: function() {
        return Session.get("kvkData") ? Session.get("kvkData").businessName : "Loading...";
    },
	initiatives: getInitiatives,
	composeOpen: function(){
		return Session.get("compose-open");
	},
    bsiData: function(){
        return Session.get("bsiData");
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
        else {
            console.log("Target: " + this.target)
            console.log("Votes: " + this.votedUsers.length)
            return (this.votedUsers.length / this.target) * 100
        }
    },
    composeOpen: function () {
        return Session.get("compose-comment-open");
    }
})

Template.Initiative.events({
    "click #endorseButton": function (evt) {
        thisUserId = Session.get("kvkData").kvknummer
        Initiatives.update({_id: this._id}, {
            $addToSet: {"votedUsers": thisUserId}
        }, false);

        var temp = Initiatives.findOne({_id:this._id}).votedUsers.length

        Initiatives.update({_id: this._id}, {
            $set: {"votes": temp}
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
        var userId = Session.get("kvkData").businessName;
        Initiatives.update({_id: this._id}, {
            $addToSet: {"commentData": {"userId":userId, "date" : new Date(), "content" : descr.val()}},
            $inc : { "comments" : 1}
        }, false);

        descr.val("");

        Session.set("compose-open", false);
        return false;
    }
})

Template.Home.events({
    "submit form#new-initiative": function (evt) {
        var title = $(evt.target).find(".input-title")
        var descr = $(evt.target).find(".input-description")
        var branch = $(evt.target).find(".input-branch")
        var selectedBranch = $(evt.target).find(".input-branch option:selected")
        var radius = $(evt.target).find(".input-radius")
        var target = $(evt.target).find(".input-target")

        kvkData = Session.get("kvkData");

        Initiatives.insert({
            title: title.val(),
            description: descr.val(),
            date: new Date(),
            radius: radius.val(),
            branchID: branch.val(),
            branchName: selectedBranch.text(),
            location: {type: "Point", coordinates: [kvkData.gpsLongitude, kvkData.gpsLatitude]},
            votes: 0,
            comments: 0,
            target: target.val(),
            kvkData: kvkData,
            phone: "+316" + kvkData.kvknummer.substring(0, 8)
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
				Session.set("radius", null);
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
		"keyup .input-radius": function (evt){
			Session.set("radius", parseInt(evt.target.value));
		}
})