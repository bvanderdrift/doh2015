Initiatives = new Meteor.Collection("initiatives");

if (Meteor.isClient) {

	Template.registerHelper("count", function(array) {
		if(typeof array == "object" && array.length)
			return array.length;
		return 0;
	});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
		// Initiatives.insert({
		// 	title: "Bierfestival",
		// 	description: "Lorum ipsum",
		// 	author: "Henk"
		// });		
  });	
}
