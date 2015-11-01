function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

InitiativePredicate = function(kvkData, initiative){
	if(!initiative.location) return false;

	dist = getDistanceFromLatLonInKm(kvkData.gpsLatitude, kvkData.gpsLongitude, initiative.location.coordinates[1], initiative.location.coordinates[0]);

	return dist < (initiative.radius);
}

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
				$maxDistance: 6000,
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
			},
			getBsiData: function(){
				var bsiData = JSON.parse(Assets.getText("bsiData.json"));
				return bsiData;
			},
			near: function(lat, lon, radius) {
				var kvkData = Meteor.http.call("GET", "http://kvkhackathon.azurewebsites.net/api/companies/byGps?latitude="+lat+"&longitude="+lon+"&radius="+radius);
				return kvkData.data;
			}
		});
	});
}
