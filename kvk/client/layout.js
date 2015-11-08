Template.ApplicationLayout.helpers({
	isActive: function(routeName){
		return (Router.current().route.getName().toLowerCase() == routeName.toLowerCase())
	},
	isLoggedIn: function(){
		return Session.get('kvkData') != undefined;
	}
})

Template.ApplicationLayout.onDestroyed = function(){
	Session.set("search", null);
	Session.set("radius", null);
}

Template.ApplicationLayout.events({
	"keyup #search": function(evt){
		if(evt.target.value)
			Session.set("search", evt.target.value);
		else
			Session.set("search", null);
	}
});