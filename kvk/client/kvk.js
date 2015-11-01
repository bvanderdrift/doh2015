Template.ApplicationLayout.onRendered(function(){
	var startKvkNr = Session.get("kvkNr");
	$("#search-company-name input").val(startKvkNr);
})

Template.ApplicationLayout.events({
    "submit form#search-company-name": function(evt) {
        var keywords = $(evt.target).find("input");

        reloadKvkData(keywords.val());

        return false;
    }
});

reloadKvkData = function(kvkNr){
	Meteor.call('filter', kvkNr, function(err, response){
			Session.set('kvkData', response);
	});
}