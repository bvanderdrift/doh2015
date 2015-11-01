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
			map: map,
			icon: blueIcon
		});

		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
	}

	if(!initiatives) return;
	if(initiatives.length > 0) {
		markerDirectory[company.kvknummer].setIcon('marker_yellow.png');
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

	blueIcon = {
	    url: 'marker_blue.png',
	    // This marker is 20 pixels wide by 32 pixels high.
	    size: new google.maps.Size(20, 20),
	    // The origin for this image is (0, 0).
	    origin: new google.maps.Point(0, 0),
	    // The anchor for this image is the base of the flagpole at (0, 32).
	    anchor: new google.maps.Point(10, 10)
	  };
	 yellowIcon = {
	    url: 'marker_yellow.png',
	    // This marker is 20 pixels wide by 32 pixels high.
	    size: new google.maps.Size(20, 20),
	    // The origin for this image is (0, 0).
	    origin: new google.maps.Point(0, 0),
	    // The anchor for this image is the base of the flagpole at (0, 32).
	    anchor: new google.maps.Point(10, 10)
	  };

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