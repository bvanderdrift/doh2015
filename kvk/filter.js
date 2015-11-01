// initiative.maxRange = 50
// initiative.position = [lat, lon]
// Initiatives.find( { "position" : { $near: CurrentPosition, distance:  } })

filteredInitiativesQuery = function (kvkData) {
	return {
		// branch: 
		// {
		// 	$in : 
		// 	[
		// 		kvkData.mainActivitySbiCode, 
		// 		kvkData.activity1SbiCode, 
		// 		kvkData.activity2SbiCode
		// 	]
		// },

		location:
		{
			$near:
			{
				$geometry:{
					type: "Point",
					coordinates: [kvkData.gpsLongitude, kvkData.gpsLatitude]
				},
				$maxDistance: 10000,
				$minDistance: 0
			}
		}
	};
}

if (Meteor.isServer) {
	Meteor.startup(function () {
	    Meteor.methods({
	    	filter: function(kvkNr){
				var kvkData = Meteor.http.call("GET", "http://kvkhackathon.azurewebsites.net/api/Companies/byKvkNumber/" + kvkNr).data;

				return kvkData[0]; //Always one element since kvkNr is unique
			},
			search: function(name) {
			   var kvkData = Meteor.http.call("GET", "http://kvkhackathon.azurewebsites.net/api/companies?tradename="+escape(name)).data;
			   return kvkData[0];
			}
	    });
	});
}
