if (Meteor.isClient) {
	var FilteredInitiatives;

	var kvkNr = '14053909';
	Session.set('kvkNr', kvkNr);

	Meteor.call('filter', kvkNr, function(err, response){
		Session.set('kvkData', response);
	});
}

// initiative.maxRange = 50
// initiative.position = [lat, lon]
// Initiatives.find( { "position" : { $near: CurrentPosition, distance:  } })

filteredInitiativesQuery = function (kvkData) {
	return {};
}

if (Meteor.isServer) {
	Meteor.startup(function () {
	    Meteor.methods({
	    	filter: function(kvkNr){
				var kvkData = Meteor.http.call("GET", "http://kvkhackathon.azurewebsites.net/api/Companies/byKvkNumber/" + kvkNr).data;

				return kvkData[0]; //Always one element since kvkNr is unique
			}
	    });
	});
}
