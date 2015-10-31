Template.Home.onRendered(function() {
	var myLatlng = new google.maps.LatLng(-34.397, 150.644);
	var mapOptions = {
	  zoom: 8,
	  center: myLatlng,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("home-map"),
	    mapOptions);
});