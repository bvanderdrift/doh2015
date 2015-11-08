Template.login.onRendered(function(){
	$("#spinnerdiv").hide();
});

Template.login.events({
	"submit form": function(e){
		e.preventDefault();

		Session.set("kvkNr", $("#inputkvknr").val());

		$("#formdiv").hide();
		$("#spinnerdiv").show();

		reloadKvkData(Session.get("kvkNr"));
	}
})