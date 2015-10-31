Initiatives = new Meteor.Collection("initiatives");

if (Meteor.isClient) {

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
