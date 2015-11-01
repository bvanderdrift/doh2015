Template.ApplicationLayout.events({
    "submit form#search-company-name": function(evt) {
        var keywords = $(evt.target).find("input");

        Meteor.call('search', keywords.val(), function(err, response){
			Session.set('kvkData', response);
		});

        return false;
    }
});