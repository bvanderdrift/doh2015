function radiusToZoom(radius){
	return Math.round(14-Math.log(radius)/Math.LN2);
}

function zoomToRadius(zoomLevel){
	return Math.pow((14-zoomLevel), 2)
}

var mapBoundsDependency = new Deps.Dependency;
var markerDirectory = {};

function addMarker(map, company, initiatives) {
	var el = initiatives && initiatives[0];
	
	if(!markerDirectory[company.kvknummer]) {
		var infowindow = new google.maps.InfoWindow({ content: (el ? el.title + " - " : "") + company.businessName });

		var marker = markerDirectory[company.kvknummer] = new google.maps.Marker({
			position: {lat: company.gpsLatitude, lng: company.gpsLongitude},
			map: map
		});

		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
	}
}

Template.Home.onRendered(function() {

		// Deps.autorun(function() {
		// 	var kvkData = Session.get("kvkData");
		// 	var myLatlng = new google.maps.LatLng(kvkData.gpsLatitude, kvkData.gpsLongitude);
		// 	var mapOptions = {
		// 	  zoom: 13,
		// 	  center: myLatlng,
		// 	  mapTypeId: google.maps.MapTypeId.ROADMAP
		// 	};
		// });

		var mapOptions = {
		  zoom: 13,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	
		var map = new google.maps.Map(document.getElementById("home-map"), mapOptions);
		map.addListener("center_changed", function(){ mapBoundsDependency.changed(); });
		map.addListener("zoom_changed", function(){ mapBoundsDependency.changed(); });

		Deps.autorun(function(){
			console.log("Map Center Autorun");
			var kvkData = Session.get("kvkData");
			if(!kvkData) return;

			var myLatlng = new google.maps.LatLng(kvkData.gpsLatitude, kvkData.gpsLongitude);
			map.setCenter(myLatlng);
		})

		Deps.autorun(function() {
			console.log("Map Marker Autorun");
			var kvkData = Session.get("kvkData");
			if(!kvkData) return;

			// Re-run upon bounds change			
			mapBoundsDependency.depend();
			
			var radius = zoomToRadius(map.getZoom());
			
			Meteor.call("near", kvkData.gpsLatitude, kvkData.gpsLongitude, radius, function(err, response){
				// Companies
				var near = response;
					
				// Initiatives
				var dictionary = getInitiatives().reduce((store, item) => {
					console.log(item);
					if(!item.kvkData)
						return store;
					store[item.kvkData.kvknummer] = store[item.kvkData.kvknummer] || [];
					store[item.kvkData.kvknummer].push(item);
					return store;
				}, {});
				
				near.forEach(company => {
					addMarker(map, company, dictionary[company.kvknummer]);
				});
			});
			
						
		});
	});