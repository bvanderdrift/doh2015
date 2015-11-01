function radiusToZoom(radius){
	return Math.round(14-Math.log(radius)/Math.LN2);
}

function zoomToRadius(zoomLevel){
	return Math.pow((14-zoomLevel), 2)
}

Template.Home.onRendered(function() {

	var mapBoundsDependency = new Deps.Dependency;
	var markerDirectory = {};
	
	function addMarker(map, company, initiatives) {
		var el = initiatives && initiatives[0];
		
		if(!markerDirectory[company.kvknummer]) {
			var infowindow = new google.maps.InfoWindow({ content: (el ? el.title + " - " : "") + company.businessName });
			var ico = company.kvknummer == Session.get("kvkData").kvknummer ? '/marker_blue_selected.png' : '/marker_blue.png';

			var marker = markerDirectory[company.kvknummer] = new google.maps.Marker({
				position: {lat: company.gpsLatitude, lng: company.gpsLongitude},
				map: map,
				icon: ico
			});

			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
		}

		var ico = company.kvknummer == Session.get("kvkData").kvknummer ? '/marker_blue_selected.png' : '/marker_blue.png';
		markerDirectory[company.kvknummer].setIcon(ico);

		if(!initiatives) return;

		if(initiatives.length > 0) {
			// var ico = company.kvknummer == Session.get("kvkData").kvknummer ? '/marker_yellow_selected.png' : '/marker_yellow.png';
			// console.log(ico)
			markerDirectory[company.kvknummer].setIcon('/marker_yellow.png');
		}
	}

	blueSelectedIcon = {
	    url: '/marker_blue_selected.png',
	    size: new google.maps.Size(20, 20),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(10, 10)
	  };
	 blueIcon = {
	    url: '/marker_blue.png',
	    size: new google.maps.Size(20, 20),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(10, 10)
	  };
	yellowIcon = {
	    url: '/marker_yellow.png',
	    size: new google.maps.Size(20, 20),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(10, 10)
	  };
	 yellowSelectedIcon = {
	    url: '/marker_yellow_selected.png',
	    size: new google.maps.Size(20, 20),
	    origin: new google.maps.Point(0, 0),
	    anchor: new google.maps.Point(10, 10)
	  };

		var mapOptions = {
		  zoom: 13,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	
		var map = new google.maps.Map(document.getElementById("home-map"), mapOptions);
		map.addListener("center_changed", function(){ mapBoundsDependency.changed(); });
		map.addListener("zoom_changed", function(){ mapBoundsDependency.changed(); });

		var radiusCircle = new google.maps.Circle({
			strokeColor: '#083764',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#000000',
			fillOpacity: 0.35,
			map: map,
		});

		Deps.autorun(function(){
			var kvkData = Session.get("kvkData");
			if(!kvkData) return;

			if(!Session.get("radius") || !Session.get("compose-open"))
				radiusCircle.setMap(null);
			else {
				radiusCircle.setMap(map);
				radiusCircle.setCenter({lat: kvkData.gpsLatitude, lng: kvkData.gpsLongitude});
				radiusCircle.setRadius(Session.get("radius"));
				map.fitBounds(radiusCircle.getBounds());
			}
		})

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