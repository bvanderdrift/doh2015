Template.Home.onRendered(function() {
	var kvkData = Session.get("kvkData");
	var myLatlng = new google.maps.LatLng(kvkData.gpsLatitude, kvkData.gpsLongitude);
	var mapOptions = {
	  zoom: 13,
	  center: myLatlng,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("home-map"),
	    mapOptions);
});