Template.ApplicationLayout.onRendered(function(){
	var startKvkNr = Session.get("kvkNr");
	$("#search-company-name input").val(startKvkNr);
})

reloadKvkData = function(kvkNr){
	Meteor.call('filter', kvkNr, function(err, response){
			Session.set('kvkData', response);
	});
}