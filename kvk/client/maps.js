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

		Deps.autorun(function() {
			var kvkData = Session.get("kvkData");
			if(!kvkData) return;
			
			var myLatlng = new google.maps.LatLng(kvkData.gpsLatitude, kvkData.gpsLongitude);
			map.setCenter(myLatlng);
			
			getInitiatives().fetch().forEach(function(el) {

			  var infowindow = new google.maps.InfoWindow({
			    content: el.title
			  });

			  var marker = new google.maps.Marker({
			    position: {lat: el.location.coordinates[0], lng: el.location.coordinates[1]},
			  	map: map
			  });

			  marker.addListener('click', function() {
			  	infowindow.open(map, marker);
			  });
			})
		});
	});